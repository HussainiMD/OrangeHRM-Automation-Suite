import {test, expect, Response, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { randomUUID } from "node:crypto";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_009
 * Verifies the login with non existent user credentials. Asserts the error message shown on page to user
 */
test('Login with Invalid Username and / or Password', async ({page}) => {
    const navResponse: Response|null = await page.goto('/web/index.php/auth/login');
    expect(navResponse?.ok()).toBe(true);

    const username: string = `invalid_user_${randomUUID()}`.slice(0, 40);//ensuring user length restrictions
    const password: string = 'does_not_exist';

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username, password});

    const alterMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');
    await expect(alterMsgContentLocator).toHaveText(/credentials/i);//RegEx to match keyword
})