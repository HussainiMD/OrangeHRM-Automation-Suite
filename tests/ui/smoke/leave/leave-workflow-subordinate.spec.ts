import pino from "pino";
import { test, Page, Response, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";

interface DatesObj {
    todayDateStr: string, 
    tomorrowDateStr: string
}

/*Utility function to get valid start & end dates for applying leave */
function getValidStartEndDatesForLeave(): DatesObj {
    const today: Date = new Date();
    
    /*Choose days from first week of the month */
    today.setDate(1);
    switch(today.getDay()) {
        case 0: today.setDate(2); //if sunday, go to next day       
        break;
        case 6: today.setDate(3); // if saturday, skip 2 days
    }
    
    const todayDateStr: string = `${today.getFullYear()}-${today.getDate()}-${today.getMonth()+1}`;//month starts with 0, hence +1
    const tomorrowDateStr: string = `${today.getFullYear()}-${today.getDate()+1}-${today.getMonth()+1}`;

    return {todayDateStr, tomorrowDateStr};
}


/*Utility function to get invalid (weekend) start & end dates for applying leave */
function getInvalidStartEndDatesForLeave(): DatesObj {
    const today: Date = new Date();

    /*Choose first weekend of the month */
    today.setDate(1);
    const deltaForNxtWeekend: number = 6 - today.getDay();
    today.setDate(1+deltaForNxtWeekend);
    
    const todayDateStr: string = `${today.getFullYear()}-${today.getDate()}-${today.getMonth()+1}`;//month starts with 0, hence +1
    const tomorrowDateStr: string = `${today.getFullYear()}-${today.getDate()+1}-${today.getMonth()+1}`;

    return {todayDateStr, tomorrowDateStr};
}


/**
 * Utility function which has common code for test execution
 * This a good demonstration of UI + API validation mix for faster test case execution
 */
async function runTest(page: Page, logger: pino.Logger, leaveDates: DatesObj): Promise<
Response> {
    const navResponse : Response | null = await page.goto('/web/index.php/leave/applyLeave');
    expect(navResponse?.ok()).toBe(true);
    
    const cardContainer: Locator = page.locator('.orangehrm-card-container');
    await expect(cardContainer).toBeVisible();

    const applyLeaveSection: Locator = cardContainer.locator('.orangehrm-main-title').filter({hasText: 'Apply Leave'});
    await expect(applyLeaveSection).not.toHaveCount(0);
    
    const formLocator: Locator = page.locator('.orangehrm-card-container .oxd-form');
    await expect(formLocator).toHaveCount(1);
    
    const leaveTypeLocator: Locator = formLocator.locator('.oxd-input-group .oxd-select-text');
    await expect(leaveTypeLocator).toBeVisible();
    
    await leaveTypeLocator.focus();
    await leaveTypeLocator.click();
    await page.keyboard.press('ArrowDown');
        
   /**We are waiting for API Response behind the scenes. This api call is triggered by Enter button on UI. 
    * Becaue listener & trigger has to be synchronized, we are using JS native promise.all() function
   */
    const [urlResponse] = await Promise.all([
        page.waitForResponse(response => 
            response.url().includes('/leave/leave-balance') && response.status() == 200
        ), 
        page.keyboard.press('Enter')
    ]) as [Response, void];
    
    expect(urlResponse.ok()).toBe(true);    

    const leaveBalanceLocator: Locator = formLocator.locator('.orangehrm-leave-balance-text');
    await expect(leaveBalanceLocator).toBeVisible();//ensure it is there before reading text
    const leaveBalance: string | null  = await leaveBalanceLocator.textContent();    
    const leaveCountBeforeApply: number = parseFloat(leaveBalance?? '0');
    expect(leaveCountBeforeApply).toBeGreaterThan(0);

    logger.info(`Total available leaves "before applying" are ${leaveCountBeforeApply}`);

    const dateInputsLocator: Locator = formLocator.locator('.oxd-input-group');
    const fromDateSectionLocator: Locator = dateInputsLocator.filter({hasText: 'From Date'});

    const fromDateLocator:Locator = fromDateSectionLocator.locator('input.oxd-input');   
    await expect(fromDateLocator).toBeEnabled();
    await fromDateLocator.fill(leaveDates.todayDateStr);
    await fromDateLocator.blur();

    const toDateSectionLocator: Locator = dateInputsLocator.filter({hasText: 'To Date'});
    const toDateLocator:Locator = toDateSectionLocator.locator('input.oxd-input');
    await expect(toDateLocator).toBeEnabled();
    await toDateLocator.fill(leaveDates.tomorrowDateStr);
    await toDateLocator.blur();

    const submitBtnLocator: Locator = formLocator.locator('button[type="submit"]');
    await expect(submitBtnLocator).toHaveCount(1);    

    /*We are monitoring the underlying API which does a POST call. Because submission of request & monitoring has to be in parellel, we are using Promise.all() */
    const [leaveRequestAPIResponse] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/leave/leave-requests')),
        submitBtnLocator.click()
    ]) as [Response, void];
    
    return leaveRequestAPIResponse;
}




/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_007
 * Verifies the Leave application flow: 
 * Ensure Leaves are available for chosen category -> Chose weekdays -> Click apply -> Verify API status (triggered behind the scenes)
 */
test('Verify Employee applied leaves shows up in his leave history', async ({essUserAuthPage, logger}) => {
    const leaveDates: DatesObj = getValidStartEndDatesForLeave();
    const applyLeavesAPIResponse: Response = await runTest(essUserAuthPage, logger, leaveDates);
    
    expect(applyLeavesAPIResponse.ok()).toBe(true);  
})


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_008
 * Verifies the Leave application flow for INVALID dates: 
 * Ensure Leaves are available for chosen category -> Chose weekends (invalid) -> Click apply -> Verify API status (triggered behind the scenes)
 * */
test('Verify weekends/invalid leave application is rejected', async ({essUserAuthPage, logger}) => {
    const leaveDates: DatesObj = getInvalidStartEndDatesForLeave();
    const applyLeavesAPIResponse: Response = await runTest(essUserAuthPage, logger, leaveDates);
    
    expect(applyLeavesAPIResponse.ok()).toBe(false);  
})


