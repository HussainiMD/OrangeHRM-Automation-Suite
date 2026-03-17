import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_002
 * Verifies the Admin (profile) user has access to Admin module in side navigation of AUT
 */
test('Verify Admin Users has access to Admin module', async ({adminUserAuthPage}) => {        
    const navResponse: Response | null = await adminUserAuthPage.goto('/web/index.php', {waitUntil: "networkidle"});
    expect(navResponse).toBeTruthy();    

    const sideNavLocator: Locator = adminUserAuthPage.locator('.oxd-sidepanel');
    await expect(sideNavLocator).toBeVisible();
    
    const adminLocator:Locator = sideNavLocator.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});
    expect(await adminLocator.count()).toBeGreaterThanOrEqual(1);

    const userMenu: UserMenu = new UserMenu(adminUserAuthPage);
    await userMenu.logOut();
})


