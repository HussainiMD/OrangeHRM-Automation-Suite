import {test, expect, Response, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { addNewESSUser } from "../../../../utils/users-manager.util";
import { randomUUID } from "crypto";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_010
 * Verifes the full flow of adding a new user as disabled. Then asserting login error at login page.
 * created disabled user -> attempt to login with user credentials
 */
test('Login with Disabled User Account', async ({page}) => {
    const navResponse: Response | null = await page.goto('/web/index.php/auth/login');
    expect(navResponse?.ok()).toBe(true);

    const newUserName: string = `disabled_user_${randomUUID()}`.slice(0, 40); //max allowed is 40 chars
    /*We are using base test employee to add a new user. There can be multiple user profiles to same employee */
    const {name:username, password} = await addNewESSUser(newUserName, false);

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username, password});

    /*extra check as sometimes it is taking more time especially during parellel executions*/
    await page.waitForSelector('.orangehrm-login-form > .orangehrm-login-error');

    const alterMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');        
    
    await expect(alterMsgContentLocator).toHaveText(/disabled/i);//RegEx to match keyword    
})