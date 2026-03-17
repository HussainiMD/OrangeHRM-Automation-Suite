import {test, expect, Response} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_012
 * Verifies the AUT behavior if the session expires and user REFRESHES the page.
 * This scenario is emulated by deleting the cookies after successful login
 * Here is the complete flow: Login as ESS user -> clear cookies (AUT domain) -> Reload the page to trigger a login verification
 */
test('User Session Expired Automatically - Re-login Required', async ({essUserAuthPage, essUserAuthContext}) => {
   
   //extracting domain name from page URL
   const domainMatchArray: RegExpMatchArray | [] = essUserAuthPage.url().match(/[://]\/\/(.+[.com])\/.*/i) ?? [];
   expect(domainMatchArray.length).toBeGreaterThan(0);

   const domain: string = domainMatchArray[1] ?? '';   
   
   /**Similating session expiry by clearing cookies */ 
   await essUserAuthContext.clearCookies({domain});
   
   const navResponse: Response | null = await essUserAuthPage.reload();
   expect(navResponse).toBeTruthy();
   await essUserAuthPage.waitForLoadState('networkidle');
   
   expect(essUserAuthPage.url()).toContain('/auth/login');   
})

