import {test, expect} from "../../../base";
import { addNewESSUser } from "../../../../utils/users-manager.util";
import { configureEmailWithSMTP, resetEmailConfiguration, addTestEmailToTestEmployee } from "../../../../utils/email-manager.util";
import { getPasswordResetLinkFromEmail } from "../../../../utils/email-parser.util";
import { doRetriedPolling } from "../../../../utils/waits-manager.util";
import ForgotPasswordPage from "../../../../pages/ForgotPasswordPage";
import ResetPasswordPage from "../../../../pages/ResetPasswordPage";
import LoginPage from "../../../../pages/LoginPage";
import { randomUUID, UUID } from "crypto";

const randomID:UUID = randomUUID();// UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
const workEmail: string = `${randomID}@mailslurp.biz`;   
const newUser: string = `resetUser_${randomID}`.slice(0, 40); //coz max lenght is 40 characters
const newPassword: string = randomID;

test.skip(true, 'Skipping this test file temporarily');

test.beforeAll(async _ =>{
    await configureEmailWithSMTP();
    await addTestEmailToTestEmployee(workEmail);
    /*We can have one base test employee but many user profiles mapped to base employee. So adding user with default password */
    await addNewESSUser(newUser);
});


/*Due to Mailtrap free account limit of 50 messages per month, I am holding on this till 10 April. So far code is working fine*/
/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_019
 * Verifies the full forgot-password recovery flow:
 * request reset → receive email → set new password → login succeeds
 */
test('End to End test case of password reset/recovery using forgot password feature', async ({page}) => {    
    
    /*Navigate to forgot password page from login page. Fill with user name and submit for password reset */
    const forgotPasswordPage: ForgotPasswordPage = await ForgotPasswordPage.create(page);
    await forgotPasswordPage.navigateToResetPasswordPage();
    await forgotPasswordPage.doPasswordResetFor(newUser);

    /*call utitlity function to extract password reset link. Wait for a second before getting password reset email */
    /*As we cannot use arbitrary wait timeouts, we are using this periodic polling function */
    const passwordResetLink: string =  await doRetriedPolling(getPasswordResetLinkFromEmail, [workEmail], {delayMs: 1000, maxTries:1});

    /*Navigate to password reset link and provide new password*/
    const resetPasswordPage: ResetPasswordPage = await ResetPasswordPage.create(page, passwordResetLink);
    await resetPasswordPage.submitNewPassword(newPassword);
    
    /*Navigate to login page and use new password for verification */
    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username: newUser, password: newPassword});

    expect(page.url()).toContain('/dashboard/index');//does it goes to dashboard    
    /*TODO: This is a necessary check (above expect check), but for an E2E password reset flow a reviewer would expect at least one more assertion — e.g., verifying a welcome message, the user's name in the header, or that the old password no longer works. The last point especially is a meaningful negative assertion:*/    
});


test.afterAll(resetEmailConfiguration);