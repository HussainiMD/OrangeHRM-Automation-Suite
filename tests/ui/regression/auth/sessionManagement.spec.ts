import {test, expect} from "../../../../fixtures/essUser-auth.fixture";

const dashboardURLRegEx: RegExp = /dashboard/i; 

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_025
 * Verifies the scenario where user clicks on browser back button after successful login to the AUT
*/
test('Browser Back Button After Login', async ({essUserAuthPage}) => {    
    await essUserAuthPage.goBack();   
    await expect(essUserAuthPage).toHaveURL(dashboardURLRegEx);
});


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_026
 * Verifies the scenario where user hits refresh button on browser after successful login to the AUT
*/
test('Refresh Page After Login', async ({essUserAuthPage}) => {    
    await essUserAuthPage.reload();    
    await expect(essUserAuthPage).toHaveURL(dashboardURLRegEx);
});