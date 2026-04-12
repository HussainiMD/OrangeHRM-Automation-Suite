import {test, expect, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { randomUUID } from "node:crypto";

const username: string = process.env.ess_user_name??'';
const password: string = process.env.ess_user_password??'';

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_009
 * Verifies the login with non existent user credentials. Asserts the error message shown on page to user
 */
test('Login with Invalid Username and / or Password', async ({page}) => {
    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();    

    const username: string = `invalid_user_${randomUUID()}`.slice(0, 40);//ensuring user length restrictions
    const password: string = 'does_not_exist';
    
    await loginPage.signInWithCredentials({username, password});

    const alertMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');
    await expect(alertMsgContentLocator, 'User alert message is not clear').toHaveText(/credentials/i);//RegEx to match keyword
})


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_046
 * Verifies the login when english case of password  (lower -> upper or upper -> lower). Asserts the error message shown on page to user
 */
test('Verify Case Sensitivity of Password', async ({page}) => {
    //change case of each alphapet in the password in order to flip it
    const flippedCasePassword = password.split('').map(char => {
        if(char.match(/[a-z]/)) return char.toUpperCase();
        if(char.match(/[A-Z]/)) return char.toLowerCase();
        return char;
    }).join('');
        
    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await loginPage.signInWithCredentials({username, password: flippedCasePassword});

    const alterMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');
    await expect(alterMsgContentLocator).toHaveText(/credentials/i);//RegEx to match keyword
})
