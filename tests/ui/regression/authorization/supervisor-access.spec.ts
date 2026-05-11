import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_005
 * Verifies the Admin (profile) user has access to Leaves module in side navigation of AUT
 */
test(
  'TC_LOGIN_005 | Authorization | Leave Module | Admin user can access Leave module',
  {
    tag: [
      '@smoke',
      '@regression',
      '@authorization',
      '@role-based-access',
      '@rbac',
      '@leave',
      '@admin',
      '@security',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Security' },

      // Functional hierarchy
      { type: 'feature', description: 'Authorization' },
      { type: 'story', description: 'Role-Based Access Control' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Leave Module Permissions' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_005' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that an administrator or supervisor user can see and access the Leave module from the application side navigation.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
    const navResponse: Response|null = await adminUserAuthPage.goto('/web/index.php/');
    expect(navResponse?.ok(),'Navigation to the home page has failed').toBe(true);    

    const sideNavLocator: Locator = adminUserAuthPage.locator('.oxd-sidepanel');
    await expect(sideNavLocator, 'Side panel on the page is not visible').toBeVisible();

    const leaveBtnLocators:Locator = sideNavLocator.locator('.oxd-main-menu-item--name').filter({hasText: 'Leave'});
    await expect(leaveBtnLocators, 'Leave button is not available').not.toHaveCount(0);    
})