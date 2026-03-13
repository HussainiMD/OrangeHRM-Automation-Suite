import {test, expect, Response, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { addNewESSUser } from "../../../../utils/users-manager.util";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_009
 */
test('Login with Disabled User Account', async ({page}) => {
    const navResponse: Response | null = await page.goto('web/index.php/auth/login');
    expect(navResponse).toBeTruthy();

    const newUserName: string = `disabled_user_${Math.random()*100}`; //randomizing just enough
    /*We are using base test employee to add a new user. There can be multiple user profiles to same employee */
    const {name:username, password} = await addNewESSUser(newUserName, false);

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username, password});

    /*extra check as sometimes it is taking more time especially during parellel executions*/
    await page.waitForSelector('.orangehrm-login-form > .orangehrm-login-error');

    const alterMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');
    expect(await alterMsgContentLocator.count()).toBe(1);

    let alterMsgContent:string  = (await alterMsgContentLocator.textContent()) ?? '';//if returns null then we will treat it as empty
    
    expect(alterMsgContent).toMatch(/disabled/i);//RegEx to match keyword    
})