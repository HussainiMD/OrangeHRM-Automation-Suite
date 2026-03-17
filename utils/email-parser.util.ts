import {request, APIRequestContext, APIResponse} from "../tests/base";
import baseLogger from "./logger";

const autURL: string = process.env.base_url ?? 'https://opensource-demo.orangehrmlive.com';
const baseURL: string = process.env.mailtrap_base_url ?? 'https://mailtrap.io';
const mailtrapAPIToken: string = process.env.mailtrap_api_token ?? '';
const mailtrapAccountId: string = process.env.mailtrap_account_id ?? '0';
const mailtrapInboxId: string = process.env.mailtrap_inbox_id ?? '0';

interface MailtrapMessageType {
    subject: string,
    sent_at: string,
    from_email: string,
    from_name: string,
    to_email: string,
    to_name: string,
    email_size: number,
    is_read: boolean,
    html_path: string
}


/**Utility function to query the Mailtrap API for account recovery email. It provides user to access the password reset link
 * It is based on the principle that email ID is unique for each attempt. 
 * So that filtering a specific email becomes simple
 * @return - string containing URL for account recovery
 */
export async function getPasswordResetLinkFromEmail(workEmail: string): Promise<string> {
    /* Single-use context per call — only one test currently uses this utility. Refactor to shared context if reuse increases.*/
    const reqContext: APIRequestContext = await request.newContext({baseURL});    
    const emailData: MailtrapMessageType = await queryAPIandExtractRelevantEmail(reqContext, workEmail);

    if(!emailData?.html_path || emailData.html_path.length == 0) 
        throw new Error(`Did not find 'html_path' property in email content. It is required to extract password reset/recovery link. Here is the email data got from API : ${JSON.stringify(emailData)}`);

    const emailHTMLPath: string = emailData.html_path;

    const emailBodyAPIResponse: APIResponse = await reqContext.get(emailHTMLPath);
    baseLogger.info(`email body API Response - ${emailBodyAPIResponse.status()}`);
    const emailBody: string = await emailBodyAPIResponse.text();
    baseLogger.debug(`Mail Trap email API response body - ${emailBody}`);

    /*Email body content should have this text to consider it as a valid/relevant email */
    if(emailBody.indexOf('To reset the password, click the link below') == -1)
        throw new Error(`Did not find content to reset password. Here is the full html content: ${emailBody}`);

    /*Regular exporession to extract password reset link*/
    const regEx: RegExp = new RegExp(`${autURL}.+(<br />)`, 'i');
    const passwordResetLinkMatches : RegExpExecArray | null = regEx.exec(emailBody);
    if(!passwordResetLinkMatches || passwordResetLinkMatches.length == 0 || passwordResetLinkMatches[0].length == 0) 
        throw new Error(`Unable to extract Password reset link from email body. Regular Expression Matches - ${JSON.stringify(passwordResetLinkMatches)}`);
    
    let passwordResetLink: string = passwordResetLinkMatches[0]; //we are interested in the matched content, which is at first index
    if(passwordResetLink.indexOf('<br') !== -1) passwordResetLink = passwordResetLink.split('<br')[0];//sometimes these html break tags appear; removing it if occurs
    
    baseLogger.debug(`password reset link found - ${passwordResetLink}`);
    await reqContext.dispose();

    return passwordResetLink;   
}


/*Test this regex code later..suggested by Claude as my RegEx is leaky of bugs*/

//const escapedURL = autURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//const regEx = new RegExp(`${escapedURL}.+?(<br\\s*/?>|$)`, 'i');
//const regEx = new RegExp(`(${escapedURL}[^\\s<]+)`, 'i');
//const match = regEx.exec(emailBody);
//const passwordResetLink = match?.[1];

 


/**helper function to query acutal mailtrap end point for all messages 
 * from the recieved emails list, filter by work email (which is unique)
 * @returns - email (relevant) meta data
 */
async function queryAPIandExtractRelevantEmail(reqContext: APIRequestContext, workEmail: string): Promise<MailtrapMessageType> {

    const apiResponse: APIResponse = await reqContext.get(`/api/accounts/${mailtrapAccountId}/inboxes/${mailtrapInboxId}/messages`, {
        headers: {
            'Api-Token' : mailtrapAPIToken
        }
    });

    baseLogger.info(`Mail Trap API Response code - ${apiResponse.status()}`);

    if(!apiResponse.ok()) throw new Error(`Unable to fetch emails list from mail trap API`);

    const mailTrapEmails: Array<MailtrapMessageType> = (await apiResponse.json()) as Array<MailtrapMessageType>;
    const filteredEmails: Array<MailtrapMessageType> = mailTrapEmails.filter(mail => mail.to_email.includes(workEmail))
    
    if(filteredEmails.length !== 1) /*Because work email is unique, only one should match in inbox */
        throw new Error(`Expecting ONE email with 'to-email' address as it is unique. But found ${filteredEmails.length} matching emails`);

    return filteredEmails[0];//only one item in array, simplifying by extracting content before returning
}