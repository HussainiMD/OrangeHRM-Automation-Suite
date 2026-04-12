import {test, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_013
 * Verifies the AUT behavior if the session expires.
 * This scenario is emulated by deleting the cookies after successful login
 * Here is the complete flow: Login as ESS user -> clear cookies (AUT domain) -> Click on My Info to trigger a login verification
 */
test('User Session Expired - Re-login enforced on User Action', async ({essUserAuthPage, essUserAuthContext}) => {
   
   const domain: string = new URL(essUserAuthPage.url()).hostname;   
   
   /**Similating session expiry by clearing cookies */ 
   await essUserAuthContext.clearCookies({domain});
   
   /*Clicking on UI element after session is expired, it automatically redirects user to login page*/
   const myInfoBtnLocator: Locator = essUserAuthPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({hasText: 'My Info'});
   await expect(myInfoBtnLocator, 'MyInfo button is not enabled').toBeEnabled();
   await myInfoBtnLocator.click();
   /*session expiry should redirect to login */
   await expect(essUserAuthPage, 'Page URL is not referring to login page').toHaveURL(/\/auth\/login/i); //does regex match with wait and auto retries after click()
})

