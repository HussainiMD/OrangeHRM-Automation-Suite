import {test, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_013
 */
test('User Session Expired - Re-login enforced on User Action', async ({essUserAuthPage, essUserAuthContext}) => {
   
   //extracting domain name from page URL
   const domainMatchArray: RegExpMatchArray | [] = essUserAuthPage.url().match(/[://]\/\/(.+[.com])\/.*/i) ?? [];
   expect(domainMatchArray.length).toBeGreaterThan(0);

   const domain: string = domainMatchArray[1] ?? '';   
   
   /**Similating session expiry by clearing cookies */ 
   await essUserAuthContext.clearCookies({domain});
   
   /*Clicking on UI element after session is expired, it automatically redirects user to login page*/
   const myInfoBtnLocator: Locator = essUserAuthPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({hasText: 'My Info'});
   await expect(myInfoBtnLocator).toBeEnabled();
   await myInfoBtnLocator.click();
   await essUserAuthPage.waitForLoadState('networkidle');
   
   expect(essUserAuthPage.url()).toContain('/auth/login');   
})

