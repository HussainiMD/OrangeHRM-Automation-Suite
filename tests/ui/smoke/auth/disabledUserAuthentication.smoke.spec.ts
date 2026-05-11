import {test, expect, Locator} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";
import { addNewESSUser } from "../../../../utils/users-manager.util";
import { randomUUID } from "crypto";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_010
 * Verifes the full flow of adding a new user as disabled. Then asserting login error at login page.
 * created disabled user -> attempt to login with user credentials
 */
test(
  'TC_LOGIN_010 | Authentication | Disabled Account | Disabled users are prevented from logging in',
  {
    tag: [
      '@security',
      '@auth',
      '@login',
      '@negative',
      '@regression',
      '@critical',
    ],
    annotation: [
      { type: 'epic', description: 'Authentication Security' },
      { type: 'feature', description: 'Account Status Enforcement' },
      { type: 'story', description: 'Prevent Login for Disabled Users' },

      { type: 'suite', description: 'Authentication Negative Scenarios' },

      { type: 'severity', description: 'critical' },

      { type: 'testCaseId', description: 'TC_LOGIN_010' },

      {
        type: 'description',
        description:
          'Verifies that a disabled user account cannot authenticate successfully and that the application displays an appropriate error message when login is attempted using disabled credentials.',
      },
    ],
  }, async ({page}) => {
    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    
    const newUserName: string = `disabled_user_${randomUUID()}`.slice(0, 40); //max allowed is 40 chars
    /*We are using base test employee to add a new user. There can be multiple user profiles to same employee */
    const {name:username, password} = await addNewESSUser(newUserName, false);
    
    await loginPage.signInWithCredentials({username, password});

    /*extra check as sometimes it is taking more time especially during parellel executions*/
    await page.waitForSelector('.orangehrm-login-form > .orangehrm-login-error');

    const alertMsgContentLocator:Locator = page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text');        
    
    await expect(alertMsgContentLocator, 'User alert message is NOT clear').toHaveText(/disabled/i);//RegEx to match keyword    
})