import { test, expect, Locator, Response } from "@playwright/test";
import LoginPage from "../../../../pages/LoginPage";
import UserMenu from "../../../../pages/components/UserMenu";
import credentials from "../../../types/credentials";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_001
 */
test('user can login, see profile button, and logout', async ({page}) => {    
    
    const loginNavResponse: Response | null = await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {waitUntil: "networkidle"});
    if(!loginNavResponse) {
       console.log('unable to navigate to login page');
       return;
    } 

    const loginPage:LoginPage = new LoginPage(page);
    const loginCredentials:credentials = {username: 'Admin', password: 'admin123'};
    await loginPage.signInWithCredentials(loginCredentials);

    const dropDown:Locator = page.locator("span[class $= 'userdropdown-tab']");
    expect(await dropDown.count()).toBe(1);    

    const userMenu:UserMenu = new UserMenu(page);
    await userMenu.logOut();
    
    await page.waitForTimeout(3000);
})