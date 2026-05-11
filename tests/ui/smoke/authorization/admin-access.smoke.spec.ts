import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_002
 * Verifies the Admin (profile) user has access to Admin module in side navigation of AUT
 */
test(
  'TC_LOGIN_002 | Authorization | RBAC | Admin module access for Admin users',
  {
    tag: [
      '@smoke',
      '@regression',
      '@auth',
      '@rbac',
      '@ui',
      '@navigation',
      '@admin',
    ],
    annotation: [
      { type: 'epic', description: 'Access Control' },
      { type: 'feature', description: 'Role Based Navigation' },
      { type: 'story', description: 'Admin module visibility for Admin users' },

      { type: 'suite', description: 'RBAC Navigation Validation' },

      { type: 'severity', description: 'critical' },

      { type: 'testCaseId', description: 'TC_LOGIN_002' },

      {
        type: 'description',
        description:
          'Verifies that users with Admin role can see and access the Admin module in the side navigation after login, ensuring proper role-based access control enforcement in the UI.',
      },
    ],
  }, async ({adminUserAuthPage}) => {        
    const navResponse: Response | null = await adminUserAuthPage.goto('/web/index.php', {waitUntil: "networkidle"});    
    expect(navResponse?.ok(),'Navigation to the default/home page has failed').toBe(true);

    const sideNavLocator: Locator = adminUserAuthPage.locator('.oxd-sidepanel');       
    const adminLocator:Locator = sideNavLocator.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});    
    await expect(adminLocator, 'Admin button is not visible').not.toHaveCount(0)

    /*log out the user */
    const userMenu: UserMenu = new UserMenu(adminUserAuthPage);
    await userMenu.logOut();
})


