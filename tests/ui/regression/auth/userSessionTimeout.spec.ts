import {test, expect, Response} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_012
 * Verifies the AUT behavior if the session expires and user REFRESHES the page.
 * This scenario is emulated by deleting the cookies after successful login
 * Here is the complete flow: Login as ESS user -> clear cookies (AUT domain) -> Reload the page to trigger a login verification
 */
test(
  'TC_LOGIN_012 | Authentication | Session Management | Session expiry forces re-login on page refresh',
  {
    tag: [
      '@smoke',
      '@regression',
      '@authentication',
      '@session-management',
      '@security',
      '@cookie',
      '@browser-refresh',
      '@login',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Security' },

      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Session Management' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Session Expiry Handling' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_012' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that when an authenticated session expires, refreshing the browser redirects the user to the login page and requires re-authentication.',
      },
    ],
  }, async ({essUserAuthPage, essUserAuthContext}) => {
   const domain: string = (new URL(essUserAuthPage.url())).hostname;   
   
   /**Similating session expiry by clearing cookies */ 
   await essUserAuthContext.clearCookies({domain});
   
   const navResponse: Response | null = await essUserAuthPage.reload();
   expect(navResponse?.ok(),'Navigation to the login page has failed').toBe(true);
   /*session expiry should redirect to login */
   await expect(essUserAuthPage, 'Page URL is not referring to login page').toHaveURL(/\/auth\/login/i);
})

