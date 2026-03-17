import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_001
 * Verifies if the valid Admin (role) user can login. 
 * Assertion happens with access to user drop down menu on top-right of the page
 */
test('user can login, see profile button, and logout', async ({adminUserAuthPage}) => {       
    const navResponse: Response |null = await adminUserAuthPage.goto('/web/index.php');    
    expect(navResponse?.ok()).toBe(true);

    const topHeaderLocator: Locator = adminUserAuthPage.locator('.oxd-topbar-header');
    await expect(topHeaderLocator).toBeVisible();
    
    const dropDown:Locator = topHeaderLocator.locator("span[class $= 'userdropdown-tab']");
    await expect(dropDown).toHaveCount(1);   //have wait and retries in built when compared to dropdown.count() option
    
    await test.step('Logout User', async () => {
        const userMenu:UserMenu = new UserMenu(adminUserAuthPage);
        await userMenu.logOut();    
    })
});