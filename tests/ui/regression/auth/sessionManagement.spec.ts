import {test, expect} from "../../../../fixtures/essUser-auth.fixture";

const dashboardURLRegEx: RegExp = /dashboard/i; 

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_025
 * Verifies the scenario where user clicks on browser back button after successful login to the AUT
*/
test(
  'TC_LOGIN_025 | Authentication | Login | Browser Back button after login preserves authenticated session',
  {
    tag: [
      '@regression',
      '@authentication',
      '@login',
      '@navigation',
      '@browser-history',
      '@security',
    ],
    annotation: [
      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Optional grouping in Allure
      { type: 'suite', description: 'Post-Login Navigation' },

      // Cross-functional classification
      { type: 'relatedFeature', description: 'Session Management' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_025' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that pressing the browser Back button after a successful login does not expose the login page and keeps the user within the authenticated application area.',
      },
    ],
  }, async ({essUserAuthPage, browserName}) => {    
    const webkitRegex = /webkit/i;
    /*BUG: up on back button, app is going to login page despite active session. Ideally it should go to dashboard page*/
    test.fail(!webkitRegex.test(browserName), 'Known bug in the app specific to firefox and chrome browsers. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
    await essUserAuthPage.goBack();   
    await expect(essUserAuthPage, 'Page URL is not what is expected').toHaveURL(dashboardURLRegEx);
});


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_026
 * Verifies the scenario where user hits refresh button on browser after successful login to the AUT
*/
test(
  'TC_LOGIN_026 | Authentication | Login | Refresh after login preserves authenticated session',
  {
    tag: [
      '@smoke',
      '@regression',
      '@authentication',
      '@login',
      '@session-management',
      '@navigation',
      '@browser-refresh',
    ],
    annotation: [
      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Optional grouping in Allure
      { type: 'suite', description: 'Post-Login Navigation' },

      // Cross-functional classification
      { type: 'relatedFeature', description: 'Session Management' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_026' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that refreshing the browser after a successful login preserves the authenticated session and keeps the user on the dashboard page.',
      },
    ],
  }, async ({essUserAuthPage}) => {    
    await essUserAuthPage.reload();    
    await expect(essUserAuthPage, 'Page URL is not what is expected').toHaveURL(dashboardURLRegEx);
});