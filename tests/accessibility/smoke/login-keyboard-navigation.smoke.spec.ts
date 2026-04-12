import {test, expect, Response, Page, Locator} from "../../base";
import UserMenu from "../../../pages/components/UserMenu";
import { getESSUserCredentials } from "../../../utils/users-manager.util";
import credentials from "../../types/credentials";

const dashboardURLRegEx: RegExp = /dashboard/i;

async function doPageFills(page: Page): Promise<void> {
    /*important to wait untill page loads completly as it does auto focus to user name field */
    const navResponse: Response | null = await page.goto('/web/index.php/auth/login', {waitUntil: 'networkidle'});
    expect(navResponse, 'Navigation to the login page has failed').toBeTruthy();
    const loginLocator: Locator = page.locator('.orangehrm-login-button');//extra check for test case stability
    await expect(loginLocator, 'login button is not visible').toBeVisible();
    await expect(loginLocator, 'login button is not enabled').toBeEnabled();
    
    const {username, password}: credentials = getESSUserCredentials();
    
    await page.keyboard.type(username);
    await page.keyboard.press('Tab');    
    await page.keyboard.type(password);
}

async function logoutUser(page:Page): Promise<void> {
    const userMenu: UserMenu = new UserMenu(page);
    await userMenu.logOut(); 
}

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_024
 * All these test cases are minor variations - hitting enter after fillin password. Going to Login button and hit enter or space bar
 */
test('Enter Key Submission for login page; password field', async ({page}) => {
    await doPageFills(page);            
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');//extra check for test case stability
    /*typical use of page.url() does NOT help here as history api based URL changes are not being detected */
    await expect(page, 'page URL did not match expectation').toHaveURL(dashboardURLRegEx);
    await logoutUser(page);
})

test('Enter Key Submission for login page; login button', async ({page}) => {
    await doPageFills(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('load');
    await expect(page, 'page URL did not match expectation').toHaveURL(dashboardURLRegEx);    
    await logoutUser(page);
})

test('Use SPACE BAR Key Submission for login page', async ({page}) => {
    await doPageFills(page);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await page.waitForLoadState('load');
    await expect(page, 'page URL did not match expectation').toHaveURL(dashboardURLRegEx);    
    await logoutUser(page);
})