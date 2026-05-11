import {test, expect, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { randomUUID } from "node:crypto";

const username: string = process.env.ess_user_name??'';
const password: string = process.env.ess_user_password??'';

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_009
 * Verifies the login with non existent user credentials. Asserts the error message shown on page to user
 */
test(
  'TC_LOGIN_009 | Authentication | Negative Login | Invalid credentials are rejected',
  {
    tag: [
      '@security',
      '@auth',
      '@login',
      '@negative',
      '@regression',
    ],
    annotation: [
      { type: 'epic', description: 'Authentication Security' },
      { type: 'feature', description: 'Login Validation' },
      { type: 'story', description: 'Reject Invalid Credentials' },

      { type: 'suite', description: 'Authentication Negative Scenarios' },

      { type: 'severity', description: 'normal' },

      { type: 'testCaseId', description: 'TC_LOGIN_009' },

      {
        type: 'description',
        description:
          'Verifies that the application correctly rejects login attempts made with invalid or non-existent username and password combinations and displays an appropriate authentication error message.',
      },
    ],
  }, async ({page}) => {
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
test(
  'TC_LOGIN_046 | Authentication | Password Policy | Password comparison is case-sensitive',
  {
    tag: [
      '@security',
      '@auth',
      '@negative',
      '@password-policy',
      '@regression',
    ],
    annotation: [
      { type: 'epic', description: 'Authentication Security' },
      { type: 'feature', description: 'Password Validation Rules' },
      { type: 'story', description: 'Enforce Case-Sensitive Password Matching' },

      { type: 'suite', description: 'Password Policy Validation' },

      { type: 'severity', description: 'normal' },

      { type: 'testCaseId', description: 'TC_LOGIN_046' },

      {
        type: 'description',
        description:
          'Verifies that password authentication is case-sensitive by attempting login with the correct password but with altered character casing, ensuring authentication fails as expected.',
      },
    ],
  }, async ({page}) => {
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
