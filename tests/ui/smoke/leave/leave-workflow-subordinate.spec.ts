import {test, Response, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";
import { getCurrentLeavesBalanceCount } from "../../../../utils/leave-management.util";


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_007
 * This a good demonstration of UI + API validation mix for faster test case execution
 */
test('Verify Employee User applied leaves shows up in his leave history', async ({essUserAuthPage, logger}) => {
    const navResponse : Response | null = await essUserAuthPage.goto('web/index.php/leave/applyLeave');
    expect(navResponse).toBeTruthy();
    await essUserAuthPage.waitForLoadState('networkidle');

    const applyLeaveSection: Locator = essUserAuthPage.locator('.orangehrm-card-container > .orangehrm-main-title').filter({hasText: 'Apply Leave'});
    expect(await applyLeaveSection.count()).toBeGreaterThan(0);

    const formLocator: Locator = essUserAuthPage.locator('.orangehrm-card-container .oxd-form');
    expect(await formLocator.count()).toBe(1);

    const leaveTypeLocator: Locator = formLocator.locator('.oxd-input-group .oxd-select-text');
    expect(await leaveTypeLocator.count()).toBeGreaterThan(0);

    await leaveTypeLocator.focus();
    await leaveTypeLocator.click();
    await essUserAuthPage.keyboard.press('ArrowDown');
        
   /**We are waiting for API Response behind the scenes. This api call is triggered by Enter button on UI. 
    * Becaue listener & trigger has to be synchronized, we are using JS native promise.all() function
   */
    const [urlResponse] = await Promise.all([
        essUserAuthPage.waitForResponse(response => 
            response.url().includes('/leave/leave-balance') && response.status() == 200
        ), 
        essUserAuthPage.keyboard.press('Enter')
    ]) as [Response, void];
    
    expect(urlResponse.status()).toBe(200);

    let leaveBalance: string | null  = await formLocator.locator('.orangehrm-leave-balance-text').textContent();
    expect(leaveBalance).toBeTruthy();    

    const leaveCountBeforeApply: number = parseFloat(leaveBalance?? '0');
    expect(leaveCountBeforeApply).toBeGreaterThan(0);

    logger.info(`Total available leaves "before applying" are ${leaveCountBeforeApply}`);

    const dateInputsLocator: Locator = formLocator.locator('.oxd-input-group');
    const fromDateSectionLocator: Locator = dateInputsLocator.filter({hasText: 'From Date'});

    const fromDateLocator:Locator = fromDateSectionLocator.locator('input.oxd-input');

    const today: Date = new Date();
    const todayDateStr: string = `${today.getFullYear()}-${today.getDate()+2}-${today.getMonth()+1}`;

    await fromDateLocator.fill(todayDateStr);
    await fromDateLocator.blur();

    const toDateSectionLocator: Locator = dateInputsLocator.filter({hasText: 'To Date'});
    const toDateLocator:Locator = toDateSectionLocator.locator('input.oxd-input');

    const tomorrowDateStr: string = `${today.getFullYear()}-${today.getDate()+3}-${today.getMonth()+1}`;

    await toDateLocator.fill(tomorrowDateStr);
    await toDateLocator.blur();

    const submitBtnLocator: Locator = formLocator.locator('button[type="submit"]');
    expect(await submitBtnLocator.count()).toBe(1);

    await submitBtnLocator.click();

    /*This arbitrary wait time is needed as backend is laggy in reflecting changes through API*/
    await essUserAuthPage.waitForTimeout(1000);

    const leaveCountAfterApply: number = await getCurrentLeavesBalanceCount(essUserAuthPage);//utility api being called
    expect(leaveCountAfterApply).toBeGreaterThan(0);

    logger.info(`Total available leaves "after applying" are ${leaveCountAfterApply}`);
    expect(leaveCountAfterApply).toBeLessThan(leaveCountBeforeApply);
  
})