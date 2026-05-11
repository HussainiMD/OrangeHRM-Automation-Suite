import {test, expect, Response, Page, Locator} from "../../base";
import UserMenu from "../../../pages/components/UserMenu";
import { getESSUserCredentials } from "../../../utils/users-manager.util";
import credentials from "../../types/credentials";

const dashboardURLRegEx: RegExp = /dashboard/i;

async function doPageFills(page: Page): Promise<void> {
    /*important to wait untill page loads completly as it does auto focus to user name field */
    const navResponse: Response | null = await page.goto('/web/index.php/auth/login', {waitUntil: 'networkidle'});
    expect(navResponse, 'Navigation to the login page has failed').toBeTruthy();
    const loginLocator: Locator = page.locator('.orangehrm-login-button');//extra check for test case stability
    await expect(loginLocator, 'login button is not visible').toBeVisible();
    await expect(loginLocator, 'login button is not enabled').toBeEnabled();
    
    const {username, password}: credentials = getESSUserCredentials();
    
    await page.keyboard.type(username);
    await page.keyboard.press('Tab');    
    await page.keyboard.type(password);
}

async function logoutUser(page:Page): Promise<void> {
    const userMenu: UserMenu = new UserMenu(page);
    await userMenu.logOut(); 
}

/**
 * ID from Test Case Spreadsheet: TC_LOGIN_024 (variant-1)
 *
 * Accessibility:
 * Verify that pressing Enter in the password field submits the login form.
 *
 * This test validates keyboard operability (WCAG 2.1.1 Keyboard)
 * and expected form behavior for keyboard-only users.
 */
test( 'TC_LOGIN_024 (variant-1): A11Y | Login | Submit form using Enter key from password field',
  {
    tag: [
      '@smoke',
      '@regression',
      '@a11y',
      '@authentication',
      '@keyboard',
      '@wcag-2.1.1',
    ],
    annotation: [
      // Functional grouping
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Accessibility-specific grouping
      { type: 'epic', description: 'Accessibility' },
      { type: 'suite', description: 'Keyboard Navigation' },

      // Standards mapping
      { type: 'wcag', description: '2.1.1 Keyboard' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_024 (variant-1)' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that pressing Enter in the password field submits the login form successfully.',
      },
    ],
  }, async ({page}) => {
    await doPageFills(page);            
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');//extra check for test case stability
    /*typical use of page.url() does NOT help here as history api based URL changes are not being detected */
    await expect(page, 'page URL did not match expectation').toHaveURL(dashboardURLRegEx);
    await logoutUser(page);
})

/**
 * ID from Test Case Spreadsheet: TC_LOGIN_024 (variant-2)
 *
 * Accessibility:
 * Verify that pressing Enter on the login button submits the login form.
 *
 * This test validates keyboard operability (WCAG 2.1.1 Keyboard)
 * and expected form behavior for keyboard-only users.
 */
test( 'TC_LOGIN_024 (variant-2): A11Y | Login | Submit form using Enter key on submit button',
  {
    tag: [
      '@smoke',
      '@regression',
      '@a11y',
      '@authentication',
      '@keyboard',
      '@wcag-2.1.1',
    ],
    annotation: [
      // Functional grouping
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Accessibility-specific grouping
      { type: 'epic', description: 'Accessibility' },
      { type: 'suite', description: 'Keyboard Navigation' },

      // Standards mapping
      { type: 'wcag', description: '2.1.1 Keyboard' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_024 (variant-2)' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verify that pressing Enter on the login button submits the login form.',
      },
    ],
  }, async ({page}) => {
    await doPageFills(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    await expect(page, 'page URL did not match expectation').toHaveURL(dashboardURLRegEx);    
    await logoutUser(page);
})

/**
 * ID from Test Case Spreadsheet: TC_LOGIN_024  (variant-3)
 *
 * Accessibility:
 * Verify that pressing Enter space bar on the login button submits the login form.
 *
 * This test validates keyboard operability (WCAG 2.1.1 Keyboard)
 * and expected form behavior for keyboard-only users.
 */
test( 'TC_LOGIN_024 (variant-3): A11Y | Login | Submit form using Space Bar key on the login button',
  {
    tag: [
      '@smoke',
      '@regression',
      '@a11y',
      '@authentication',
      '@keyboard',
      '@wcag-2.1.1',
    ],
    annotation: [
      // Functional grouping
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Accessibility-specific grouping
      { type: 'epic', description: 'Accessibility' },
      { type: 'suite', description: 'Keyboard Navigation' },

      // Standards mapping
      { type: 'wcag', description: '2.1.1 Keyboard' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_024 (variant-3)' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verify that pressing Enter space bar on the Login button submits the login form.',
      },
    ],
  }, async ({page}) => {
    await doPageFills(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForLoadState('load');
    await expect(page, 'page URL did not match expectation').toHaveURL(dashboardURLRegEx);    
    await logoutUser(page);
})