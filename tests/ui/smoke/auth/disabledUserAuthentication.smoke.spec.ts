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
    const {name:username, password} = await addNewESSUser(newUserName, false);

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username, password});

    const alterMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');
    expect(await alterMsgContentLocator.count()).toBe(1);

    let alterMsgContent:string  = (await alterMsgContentLocator.textContent()) ?? '';//if returns null then we will treat it as empty
    
    expect(alterMsgContent).toMatch(/disabled/i);//RegEx to match keyword    
})