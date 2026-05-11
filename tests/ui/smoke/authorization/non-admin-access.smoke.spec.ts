import { expect, Locator, test } from "../../../../fixtures/essUser-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_003
 * Verifies the ESS user (regular profile) user does NOT has access to Admin module 
 */
test(
  'TC_LOGIN_003 | Authorization | RBAC | ESS users cannot access Admin module',
  {
    tag: [
      '@smoke',
      '@regression',
      '@auth',
      '@rbac',
      '@negative',
      '@security',
    ],
    annotation: [
      { type: 'epic', description: 'Access Control' },
      { type: 'feature', description: 'Role Based Access Control' },
      { type: 'story', description: 'Restrict Admin module access for ESS users' },

      { type: 'suite', description: 'RBAC Negative Access Validation' },

      { type: 'severity', description: 'critical' },

      { type: 'testCaseId', description: 'TC_LOGIN_003' },

      {
        type: 'description',
        description:
          'Verifies that ESS (non-admin) users cannot see or access the Admin module in the application side navigation, ensuring proper enforcement of role-based access control.',
      },
    ],
  }, async ({essUserAuthPage}) => {    
    const adminLocator:Locator = essUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});    
    await expect(adminLocator, 'Admin button is not visible').toHaveCount(0);//Should NOT be visible to non admin (ESS) user

    const userMenu: UserMenu = new UserMenu(essUserAuthPage);
    await userMenu.logOut();
})

