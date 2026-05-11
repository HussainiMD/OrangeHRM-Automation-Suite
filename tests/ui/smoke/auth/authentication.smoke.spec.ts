import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_001
 * Verifies if the valid Admin (role) user can login. 
 * Assertion happens with access to user drop down menu on top-right of the page
 */
test(
  'TC_LOGIN_001 | Authentication | Login | Admin user can log in and access logout menu',
  {
    tag: [
      '@smoke',
      '@regression',
      '@login',
      '@authentication',
      '@admin',
      '@critical',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Admin Login' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Login and Logout' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_001' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that a valid Admin user can successfully authenticate, access the user dropdown menu in the application header, and log out of the application.',
      },
    ],
  }, async ({adminUserAuthPage}) => {       
    const navResponse: Response |null = await adminUserAuthPage.goto('/web/index.php');    
    expect(navResponse?.ok(),'Navigation to the home page has failed').toBe(true);

    const topHeaderLocator: Locator = adminUserAuthPage.locator('.oxd-topbar-header');
    await expect(topHeaderLocator, 'top level header on page is not visible').toBeVisible();
    
    const dropDown:Locator = topHeaderLocator.locator("span[class $= 'userdropdown-tab']");
    await expect(dropDown, 'drop down menu in top header is not available').toHaveCount(1);   //have wait and retries in built when compared to dropdown.count() option
    
    await test.step('Logout User', async () => {
        const userMenu:UserMenu = new UserMenu(adminUserAuthPage);
        await userMenu.logOut();    
    })
});