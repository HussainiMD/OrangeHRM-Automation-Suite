import { expect, Locator, test } from "../../../../fixtures/essUser-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_003
 * Verifies the ESS user (regular profile) user does NOT has access to Admin module 
 */
test('Verify ESS Users has NO access to Admin module', async ({essUserAuthPage}) => {    
    const adminLocator:Locator = essUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});    
    await expect(adminLocator, 'Admin button is not visible').toHaveCount(0);//Should NOT be visible to non admin (ESS) user

    const userMenu: UserMenu = new UserMenu(essUserAuthPage);
    await userMenu.logOut();
})

