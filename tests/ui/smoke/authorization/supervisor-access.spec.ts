import { expect, Locator, Response, test } from "../../../../fixtures/admin-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_005
 * Verifies the Admin (profile) user has access to Leaves module in side navigation of AUT
 */
test('Verify Supervisor/Manager User has access to Leaves module', async ({adminUserAuthPage}) => {
    const navResponse: Response|null = await adminUserAuthPage.goto('/web/index.php/');
    expect(navResponse?.ok()).toBe(true);    

    const sideNavLocator: Locator = adminUserAuthPage.locator('.oxd-sidepanel');
    await expect(sideNavLocator).toBeVisible();

    const leaveBtnLocators:Locator = sideNavLocator.locator('.oxd-main-menu-item--name').filter({hasText: 'Leave'});
    await expect(leaveBtnLocators).not.toHaveCount(0);    
})