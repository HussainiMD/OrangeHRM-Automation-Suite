import { expect, Locator, Response } from "@playwright/test";
import {test} from "../../../../fixtures/admin-auth.fixture";
import LoginPage from "../../../../pages/LoginPage";
import UserMenu from "../../../../pages/components/UserMenu";
import credentials from "../../../types/credentials";
import {createTestLogger} from "../../../../utils/logger";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_001
 */
test('user can login, see profile button, and logout', async ({adminUserAuthPage}, testInfo) => {       
    const navResponse: Response |null = await adminUserAuthPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php', {waitUntil: "networkidle"});
    expect(navResponse).toBeTruthy();

    const dropDown:Locator = adminUserAuthPage.locator("span[class $= 'userdropdown-tab']");
    expect(await dropDown.count()).toBe(1);    

    const logger = createTestLogger(testInfo);
    logger.info('done with testing after login..going to logout')
    const userMenu:UserMenu = new UserMenu(adminUserAuthPage);
    await userMenu.logOut();    
})