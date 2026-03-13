import { APIResponse, APIRequestContext } from "../tests/base";
import { getTestEmployeeNumber } from "./users-manager.util";
import { getValidAdminRequestContext } from "./auth-manager.utils";
import baseLogger from "./logger";

async function updateEmailConfiguration(data: object): Promise<void> {    
    const requestContext: APIRequestContext = await getValidAdminRequestContext();
    const updateEmailConfigResponse: APIResponse = await requestContext.put('/web/index.php/api/v2/admin/email-configuration', {
        headers: {
            "Content-Type": "application/json"
        },
        data
    });

    if(!updateEmailConfigResponse.ok()) {
        const msg: string = `Unable to update email configuration for adding SMTP server details - API Response is ${updateEmailConfigResponse.status()} & text message - ${await updateEmailConfigResponse.text()}`;
        baseLogger.warn(msg);
        
        throw msg;
    }

}

/**To add SMTP configuration
 * @returns void
 */
export async function configureEmailWithSMTP(): Promise<void> {
    const data: object = {
            "mailType": "smtp",
            "sentAs": "admin@mail.com",
            "smtpHost": "sandbox.smtp.mailtrap.io",
            "smtpPort": 2525,
            "smtpUsername": process.env.mailtrap_smtp_user_name ?? "3b00825412776d", //"4112eef58bbcdd",
            "smtpPassword": process.env.mailtrap_smtp_user_Password ?? "82f05d4b6c59f3", //"6225a86e87503c",
            "smtpAuthType": "login",
            "smtpSecurityType": "none"
    };

    baseLogger.info(`Going to update the Email Configuration with Mailtrap SMTP credentials`);

    return await updateEmailConfiguration(data);  
}

/**Reset the Email configuraiton
 * @returns void
 */
export async function resetEmailConfiguration(): Promise<void> {
     const data: object = {
        "mailType": "sendmail",
        "sentAs": "admin@mail.com",
        "smtpHost": "dummy.smtp",
        "smtpPort": 0,
        "smtpUsername": "",
        "smtpPassword": "",
        "smtpAuthType": "none",
        "smtpSecurityType": "none"
    };
    

    baseLogger.info(`Resetting email configuration by removing Mailtrap SMTP configuration`);
    return await updateEmailConfiguration(data);  

}


/**add test Email to the test employee 
 * @returns void
 */
export async function addTestEmailToTestEmployee(workEmail: string): Promise<void> {
    const empNumber: number = getTestEmployeeNumber();    
    const data = {
        "street1": "",
        "street2": "",
        "city": "",
        "province": "",
        "zipCode": null,
        "homeTelephone": null,
        "workTelephone": null,
        "mobile": null,
        workEmail ,
        "otherEmail": null
    }

    const requestContext: APIRequestContext = await getValidAdminRequestContext();
    const response: APIResponse = await requestContext.put(`https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employee/${empNumber}/contact-details`, {
        headers: {
            "Content-Type": "application/json"
        },
        data
    });

    if(!response.ok()) throw new Error(`Unable to add test email "${workEmail}" to the test employee (number) - ${empNumber}`);
}

