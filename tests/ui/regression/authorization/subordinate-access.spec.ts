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
    await expect(leaveBtnLocator, 'leave button is not visible').toBeVisible();
    await leaveBtnLocator.click();    
    
    const navItems: Locator = essUserAuthPage.getByRole('navigation', { name: /Topbar/i }).locator('.oxd-topbar-body-nav-tab-item');       
    await expect(navItems, 'There are NO top level navigation items').not.toHaveCount(0);

    const configureBtn: Locator = navItems.filter({hasText: 'Configure '});    
    await expect(configureBtn, 'Configure Button is not available').toHaveCount(0);

    const leaveListBtn: Locator = navItems.filter({hasText: 'Leave List'});    
    await expect(leaveListBtn, 'Leave list button is not available').toHaveCount(0);

    const assignLeaveBtn: Locator = navItems.filter({hasText: 'Assign Leave'});    
    await expect(assignLeaveBtn, 'Assign Leave button is not available').toHaveCount(0);

    const myLeaveBtn: Locator = navItems.filter({hasText: 'My Leave'});    
    await expect(myLeaveBtn, 'My Leave Button is not available').not.toHaveCount(0);
})