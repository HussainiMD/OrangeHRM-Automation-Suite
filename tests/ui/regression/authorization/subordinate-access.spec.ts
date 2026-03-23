import {test, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_006
 * Verifies the ESS user (normal profile) user has limited access to Leaves module in side navigation of AUT
 * Allowed Access - My leaves section
 * Restricted Acess - Configure, Leave List and Assign Leave
 */
test('Verify Sub-ordinate Employee User has LIMITED access to Leaves module', async ({essUserAuthPage}) => {    
    const leaveBtnLocator: Locator = essUserAuthPage.locator('.oxd-main-menu-item--name').filter({hasText: 'Leave'});    
    // await expect(leaveBtnLocator).not.toHaveCount(0);//ensuring that leave btn is there before clicking
    await expect(leaveBtnLocator).toBeVisible();
    await leaveBtnLocator.click();    
    
    const navItems: Locator = essUserAuthPage.getByRole('navigation', { name: /Topbar/i }).locator('.oxd-topbar-body-nav-tab-item');       
    await expect(navItems).not.toHaveCount(0);

    const configureBtn: Locator = navItems.filter({hasText: 'Configure '});    
    await expect(configureBtn).toHaveCount(0);

    const leaveListBtn: Locator = navItems.filter({hasText: 'Leave List'});    
    await expect(leaveListBtn).toHaveCount(0);

    const assignLeaveBtn: Locator = navItems.filter({hasText: 'Assign Leave'});    
    await expect(assignLeaveBtn).toHaveCount(0);

    const myLeaveBtn: Locator = navItems.filter({hasText: 'My Leave'});    
    await expect(myLeaveBtn).not.toHaveCount(0);
})