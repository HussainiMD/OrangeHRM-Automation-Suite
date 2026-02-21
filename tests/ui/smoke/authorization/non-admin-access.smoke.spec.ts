import {test, expect, Browser, Locator, Response} from "@playwright/test";
import LoginPage from "../../../../pages/LoginPage";
import UserMenu from "../../../../pages/components/UserMenu";
import UserType from "../../../types/UserType";
import { addNewESSUser } from "../../../../utils/users-manager.util";

test.describe.configure({mode: "parallel", timeout: 30000});

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_003
 */
test('Verify ESS Users has NO access to Admin module', async ({page}, testInfo) => {
    const user:UserType = await addNewESSUser('playwright', testInfo);    
    const navResponse:Response | null = await page.goto('/web/index.php/auth/login')
    expect(navResponse).toBeTruthy();

    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username: user.name, password: user.password});
    await page.waitForLoadState("networkidle");

    const adminLocator:Locator = page.locator('.oxd-main-menu-item--name').filter({hasText: 'Admin'});
    expect(await adminLocator.count()).toBe(0);//Should NOT be visible to non admin (ESS) user

    const userMenu: UserMenu = new UserMenu(page);
    await userMenu.logOut();
})

