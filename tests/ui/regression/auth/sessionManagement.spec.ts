import {test, expect} from "../../../../fixtures/essUser-auth.fixture";

const dashboardURLRegEx: RegExp = /dashboard/i; 

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_025
 * Verifies the scenario where user clicks on browser back button after successful login to the AUT
*/
test('Browser Back Button After Login', async ({essUserAuthPage}) => {    
    /*BUG: up on back button, app is going to login page despite active session. Ideally it should go to dashboard page*/
    test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
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