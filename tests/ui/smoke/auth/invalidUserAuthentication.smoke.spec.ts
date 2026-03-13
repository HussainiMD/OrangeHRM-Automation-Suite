import {test, expect, Response, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { randomUUID } from "node:crypto";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_008
 */
test('Login with Invalid Username and / or Password', async ({page}) => {
    const navResponse: Response|null = await page.goto('web/index.php/auth/login');
    expect(navResponse).toBeTruthy();

    const username: string = `invalid_user_${randomUUID()}`.slice(0, 40);//ensuring user length restrictions
    const password: string = 'does_not_exist';

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username, password});

    const alterMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');
    expect(await alterMsgContentLocator.count()).toBe(1);

    let alterMsgContent:string  = (await alterMsgContentLocator.textContent()) ?? '';//if returns null then we will treat it as empty

    expect(alterMsgContent).toMatch(/credentials/i);//RegEx to match keyword
})