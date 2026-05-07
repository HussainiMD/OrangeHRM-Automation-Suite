import { test, expect, Locator, Page} from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { UserListPage } from '../../../../pages/UserListPage';
import { EditUserPage } from '../../../../pages/EditUserPage';
import LoginPage from '../../../../pages/LoginPage';
import { getFreshcontextPage } from '../../../../utils/page-manager.util';
import { addNewESSUser } from "../../../../utils/users-manager.util";
import { randomUUID } from "crypto";

/**
 * Navigate to Admin > User Management and filter by username.
 * Returns the matching result row locator.
 */
 async function navigateAndSearchUser(page: Page, username: string): Promise<Locator> {
    await page.goto('/web/index.php/dashboard/index');

    const navigationPage = new NavigationPage(page);
    await expect(navigationPage.getAdminNavItem(), 'Admin nav item should be visible').toBeVisible();
    await navigationPage.navigateToAdmin();

    const userListPage = new UserListPage(page);
    await userListPage.getSearchUserNameInput().fill(username);
    await userListPage.getSearchButton().click();

    return userListPage.getSearchResultsBy(username);
}

/**
 * On the Edit User page: toggle status dropdown and save.
 * Asserts the PUT /admin/users call returns 200.
 */
async function toggleUserStatusAndSave(page: Page): Promise<void> {
    const editUserPage = new EditUserPage(page);
    const dropdown = editUserPage.getStatusDropdown();

    await dropdown.focus();
    await dropdown.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    const [apiResponse] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/admin/users') && res.request().method() === 'PUT'),
        editUserPage.getSaveButton().click(),
    ]);

    expect(apiResponse.status()).toBe(200);
}

/**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_STATUS_001
 * Verify User Search by Username returns correct record. 
 */
test('Verify User Search by Username returns correct record', async ({ adminUserAuthPage }) => {
    const username = `user_${randomUUID()}`.slice(0, 40);
    await addNewESSUser(username, false);

    const resultRow = await navigateAndSearchUser(adminUserAuthPage, username);
    await expect(resultRow, 'Created user was not found in search results').not.toHaveCount(0);
});

/**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_STATUS_004
 * Verify Admin can re-enable a disabled user 
 */
test('Verify Admin can re-enable a disabled user', async ({ adminUserAuthPage }) => {
    const username = `user_${randomUUID()}`.slice(0, 40);
    await addNewESSUser(username, false);

    const resultRow = await navigateAndSearchUser(adminUserAuthPage, username);
    await expect(resultRow, 'Expected exactly one matching user').toHaveCount(1);

    const userListPage = new UserListPage(adminUserAuthPage);
    await userListPage.getEditButtonFor(resultRow).click();

    await toggleUserStatusAndSave(adminUserAuthPage);
});

/**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_STATUS_005
 * Verify disabled user can login again after re-enabling 
 */
test('Verify disabled user can login again after re-enabling', async ({ adminUserAuthPage, browser }) => {
    const username = `user_${randomUUID()}`.slice(0, 40);
    const { password } = await addNewESSUser(username, false);

    const resultRow = await navigateAndSearchUser(adminUserAuthPage, username);
    await expect(resultRow, 'Expected exactly one matching user').toHaveCount(1);

    const userListPage = new UserListPage(adminUserAuthPage);
    await userListPage.getEditButtonFor(resultRow).click();

    await toggleUserStatusAndSave(adminUserAuthPage);

    // Verify the re-enabled user can actually log in
    const freshPage: Page = await getFreshcontextPage(browser);
    const loginPage = new LoginPage(freshPage);
    await loginPage.navigateToLoginPage();
    await loginPage.signInWithCredentials({ username, password });

    const myInfoBtn = freshPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({ hasText: /My\s+Info/i });
    await expect(myInfoBtn, '"My Info" button not visible — login may have failed').toBeVisible();
});

/**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_STATUS_006
 * Verify disabled user session is terminated if already logged in 
 */
test('Verify disabled user session is terminated if already logged in', async ({ adminUserAuthPage, browser }) => {
    const username = `user_${randomUUID()}`.slice(0, 40);
    const { password } = await addNewESSUser(username, true);

     // Verify the re-enabled user can actually log in
    const freshPage: Page = await getFreshcontextPage(browser);
    const loginPage = new LoginPage(freshPage);
    await loginPage.navigateToLoginPage();
    await loginPage.signInWithCredentials({ username, password });
    const essUserMyInfoBtn: Locator = freshPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({ hasText: /My\s+Info/i });
    await expect(essUserMyInfoBtn, '"My Info" button not visible — login may has failed').toBeVisible();

    const resultRow = await navigateAndSearchUser(adminUserAuthPage, username);
    await expect(resultRow, 'Expected exactly one matching user').toHaveCount(1);

    const userListPage = new UserListPage(adminUserAuthPage);
    await userListPage.getEditButtonFor(resultRow).click();

    await toggleUserStatusAndSave(adminUserAuthPage);
    await essUserMyInfoBtn.click(); //mimic user activity on the current page

    expect(freshPage.url(), 'User is supposed to be logged out of the active session but he is NOT').toMatch(/auth\/login/i);
    
});

/**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_STATUS_007
 * Verify disabled user cannot access any system modules via direct URL
 */
test.only('Verify disabled user cannot access any system modules via direct URL', async ({ adminUserAuthPage, browser }) => {
    const username = `user_${randomUUID()}`.slice(0, 40);
    const { password } = await addNewESSUser(username, true);

     // Verify the re-enabled user can actually log in
    const freshPage: Page = await getFreshcontextPage(browser);
    const loginPage = new LoginPage(freshPage);
    await loginPage.navigateToLoginPage();
    await loginPage.signInWithCredentials({ username, password });
    const essUserMyInfoBtn: Locator = freshPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({ hasText: /My\s+Info/i });
    await expect(essUserMyInfoBtn, '"My Info" button not visible — login may has failed').toBeVisible();

    const resultRow = await navigateAndSearchUser(adminUserAuthPage, username);
    await expect(resultRow, 'Expected exactly one matching user').toHaveCount(1);

    const userListPage = new UserListPage(adminUserAuthPage);
    await userListPage.getEditButtonFor(resultRow).click();

    await toggleUserStatusAndSave(adminUserAuthPage);    

    await freshPage.goto('/web/index.php/admin/viewSystemUsers'); //navigate to inaccessible module
    expect(freshPage.url(), 'User is supposed to be logged out of the active session but he is NOT').toMatch(/auth\/login/i);
});
