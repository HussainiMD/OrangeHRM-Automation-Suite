import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";
import UserMenu from "../../../../pages/components/UserMenu";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_001
 * Verifies if the valid Admin (role) user can login. 
 * Assertion happens with access to user drop down menu on top-right of the page
 */
test('user can login, see profile button, and logout', async ({adminUserAuthPage, logger}) => {       
    const navResponse: Response |null = await adminUserAuthPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php', {waitUntil: "networkidle"});
    expect(navResponse).toBeTruthy();

    const topHeaderLocator: Locator = adminUserAuthPage.locator('.oxd-topbar-header');
    await expect(topHeaderLocator).toBeVisible();
    
    const dropDown:Locator = topHeaderLocator.locator("span[class $= 'userdropdown-tab']");
    expect(await dropDown.count()).toBe(1);    
    
    logger.info('done with testing after login..going to logout')
    const userMenu:UserMenu = new UserMenu(adminUserAuthPage);
    await userMenu.logOut();    
});