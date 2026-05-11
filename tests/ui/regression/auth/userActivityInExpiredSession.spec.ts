import {test, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_013
 * Verifies the AUT behavior if the session expires.
 * This scenario is emulated by deleting the cookies after successful login
 * Here is the complete flow: Login as ESS user -> clear cookies (AUT domain) -> Click on My Info to trigger a login verification
 */
test(
  'TC_LOGIN_013 | Authentication | Session Management | Session expiry forces re-login on user action',
  {
    tag: [
      '@smoke',
      '@regression',
      '@authentication',
      '@session-management',
      '@security',
      '@cookie',
      '@login',
    ],
    annotation: [
      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Session Management' },

      // Optional grouping in Allure
      { type: 'suite', description: 'Session Expiry Handling' },

      // Cross-functional classification
      { type: 'relatedFeature', description: 'Security' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_013' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that when an authenticated session expires, the application redirects the user to the login page when the user attempts to access a protected module.',
      },
    ],
  }, async ({essUserAuthPage, essUserAuthContext, browserName}) => {
   
   const domain: string = new URL(essUserAuthPage.url()).hostname;   
   
   /**Similating session expiry by clearing cookies */ 
   await essUserAuthContext.clearCookies({domain});
   
   if((/webkit/i).test(browserName)) await essUserAuthPage.waitForLoadState('networkidle');//webkit sometimes causes UI freezes
   /*Clicking on UI element after session is expired, it automatically redirects user to login page*/
   const myInfoBtnLocator: Locator = essUserAuthPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({hasText: 'My Info'});
   await expect(myInfoBtnLocator, 'MyInfo button is not enabled').toBeEnabled();   
   await myInfoBtnLocator.click();
   /*session expiry should redirect to login */
   await expect(essUserAuthPage, 'Page URL is not referring to login page').toHaveURL(/\/auth\/login/i); //does regex match with wait and auto retries after click()
})

