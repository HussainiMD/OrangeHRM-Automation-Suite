import {test, expect, Browser, Locator, Response} from "@playwright/test";
import LoginPage from "../../../../pages/LoginPage";
import UserMenu from "../../../../pages/components/UserMenu";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_002
 */
test('Verify Admin Users has access to Admin module', async ({page}) => {
    const navResponse:Response | null = await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    expect(navResponse).toBeTruthy();

    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username: 'Admin', password:'admin123'});
    await page.waitForLoadState("networkidle");

    const adminLocator:Locator = page.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});
    expect(await adminLocator.count()).toBeGreaterThanOrEqual(1);

    const userMenu: UserMenu = new UserMenu(page);
    await userMenu.logOut();
})