import {test, expect, Browser, Locator, Response} from "../../../../fixtures/essUser-auth.fixture";
import LoginPage from "../../../../pages/LoginPage";
import UserMenu from "../../../../pages/components/UserMenu";
import UserType from "../../../types/UserType";
import { addNewESSUser } from "../../../../utils/users-manager.util";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_003
 */
test('Verify ESS Users has NO access to Admin module', async ({essUserAuthPage}, testInfo) => {    
    const adminLocator:Locator = essUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});
    expect(await adminLocator.count()).toBe(0);//Should NOT be visible to non admin (ESS) user

    const userMenu: UserMenu = new UserMenu(essUserAuthPage);
    await userMenu.logOut();
})

