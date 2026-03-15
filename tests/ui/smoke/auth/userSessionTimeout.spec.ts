import {test, expect, Response} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_012
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

