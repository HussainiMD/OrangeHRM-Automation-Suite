import {test, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_006
 * Verifies the ESS user (normal profile) user has limited access to Leaves module in side navigation of AUT
 * Allowed Access - My leaves section
 * Restricted Acess - Configure, Leave List and Assign Leave
 */
test('Verify Sub-ordinate Employee User has LIMITED access to Leaves module', async ({essUserAuthPage}) => {    
    const leaveBtnLocator: Locator = essUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Leave'});
    expect(await leaveBtnLocator.count()).toBeGreaterThan(0);
    await leaveBtnLocator.click();
    await essUserAuthPage.waitForLoadState("networkidle");
    
    const navItems: Locator = essUserAuthPage.getByRole('navigation', { name: /Topbar/i }).locator('.oxd-topbar-body-nav-tab-item');   

    const configureBtn: Locator = navItems.filter({hasText: 'Configure '});
    expect(await configureBtn.count()).toBe(0);

    const leaveListBtn: Locator = navItems.filter({hasText: 'Leave List'});
    expect(await leaveListBtn.count()).toBe(0);

    const assignLeaveBtn: Locator = navItems.filter({hasText: 'Assign Leave'});
    expect(await assignLeaveBtn.count()).toBe(0);

    const myLeaveBtn: Locator = navItems.filter({hasText: 'My Leave'});
    expect(await myLeaveBtn.count()).toBeGreaterThan(0);    
})