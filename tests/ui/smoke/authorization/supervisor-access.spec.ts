import {expect, Response, Locator} from "@playwright/test";
import {test} from "../../../../fixtures/admin-auth.fixture"
import LoginPage from "../../../../pages/LoginPage";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_005
 */
test('Verify Supervisor/Manager User has access to Leaves module', async ({adminUserAuthPage}) => {
    const navResponse: Response|null = await adminUserAuthPage.goto('/web/index.php/', {waitUntil: "networkidle"});
    expect(navResponse).toBeTruthy();   
    
    const leaveBtnLocators:Locator = adminUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Leave'});
    const btnCount:number = await leaveBtnLocators.count()
    expect(btnCount).toBeGreaterThanOrEqual(1);
})