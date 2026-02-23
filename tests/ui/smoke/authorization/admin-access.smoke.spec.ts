import {expect, Browser, Locator, Response} from "@playwright/test";
import {test} from "../../../../fixtures/admin-auth.fixtures";
import LoginPage from "../../../../pages/LoginPage";
import UserMenu from "../../../../pages/components/UserMenu";
import UserType from "../../../types/UserType";
import { addNewESSUser } from "../../../../utils/users-manager.util";

test.describe.configure({mode: "parallel", timeout: 30000});

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_002
 */
test('Verify Admin Users has access to Admin module', async ({adminUserAuthPage}) => {    
    const navResponse: Response | null = await adminUserAuthPage.goto('/web/index.php', {waitUntil: "networkidle"});
    expect(navResponse).toBeTruthy();    
    
    const adminLocator:Locator = adminUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});
    expect(await adminLocator.count()).toBeGreaterThanOrEqual(1);

    const userMenu: UserMenu = new UserMenu(adminUserAuthPage);
    await userMenu.logOut();
})


