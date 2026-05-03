import { test, expect } from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { PimEmployeeListPage } from '../../../../pages/PimEmployeeListPage';
import { AddEmployeePage } from '../../../../pages/AddEmployeePage';


/** ── Slow 3G network profile (matches Chrome DevTools "Slow 3G" preset) ────────
* Typed explicitly so TypeScript resolves it against the CDP
* Network.emulateNetworkConditions parameter shape without complaints.
*/
const SLOW_3G: {
  offline: boolean;
  latency: number;
  downloadThroughput: number;
  uploadThroughput: number;
} = {
  offline: false,
  latency: 400,                         // ms round-trip latency
  downloadThroughput: 500 * 1024 / 8,   // 500 kbps → bytes/sec
  uploadThroughput: 500 * 1024 / 8,     // 500 kbps → bytes/sec
};
 
// Generous timeout for assertions that wait on network responses under throttling.
// Slow 3G adds ~400 ms latency per request on top of normal page load time.
const SLOW_NETWORK_TIMEOUT = 30_000;

/**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_040
    * Verify Add Employee with credentials succeeds under Slow 3G network conditions.
 */
  test('Verify Add Employee with credentials succeeds under Slow 3G network conditions', async ({ adminUserAuthPage, browserName, logger }) => {
 
    // Skip non-Chromium browsers. CDP network throttling is a Chromium-only API. 
    if (browserName !== 'chromium') {
      const msg: string = `Network throttling via CDP is only supported in Chromium. Current browser: ${browserName}. Skipping this test.`;
      logger.warn(msg);
      test.skip(true, msg);
    }
 
    //Open CDP session and emulate Slow 3G ─────────────────────────
    const cdpSession = await adminUserAuthPage.context().newCDPSession(adminUserAuthPage);
    await cdpSession.send('Network.enable');
    await cdpSession.send('Network.emulateNetworkConditions', SLOW_3G);
 
    try {
      await adminUserAuthPage.goto('/web/index.php/dashboard/index'); 
      const navigationPage = new NavigationPage(adminUserAuthPage);
      await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar' ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT });
 
      await navigationPage.navigateToPim();
      const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
      await expect( pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation'
      ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT }); 
      await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation'
      ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT });
 
      await pimEmployeeListPage.navigateToAddEmployee(); 
      const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
      await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded'
      ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT });
 
      await addEmployeePage.fillFirstName('John');
      await addEmployeePage.fillLastName('TestAuto');
 
      await addEmployeePage.clickCreateLoginDetails();
 
      const uniqueUsername = `test_user_${Date.now()}`;
      await addEmployeePage.fillUserName(uniqueUsername);
 
      const testPassword = 'Test@Pass1';
      await addEmployeePage.fillPassword(testPassword);
      await addEmployeePage.fillConfirmPassword(testPassword);
      await addEmployeePage.clickSave();
 
      // No field validation errors ───────────────────────────────
      await expect( addEmployeePage.getFirstNameFieldError(), 'First Name field should NOT display a validation error after successful save'
      ).not.toBeVisible(); 
      await expect( addEmployeePage.getLastNameFieldError(), 'Last Name field should NOT display a validation error after successful save'
      ).not.toBeVisible(); 
      await expect( addEmployeePage.getUsernameFieldError(), 'Username field should NOT display a validation error after successful save'
      ).not.toBeVisible(); 
      await expect( addEmployeePage.getPasswordFieldError(), 'Password field should NOT display a validation error after successful save'
      ).not.toBeVisible(); 
      await expect( addEmployeePage.getConfirmPasswordFieldError(), 'Confirm Password field should NOT display a validation error after successful save' ).not.toBeVisible();
 
      //Redirect confirms server persisted the record ────────────
      await expect( adminUserAuthPage, 'URL should change to employee profile page after successful save under Slow 3G — ' +
        'confirms the server round-trip completed despite throttled network' ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: SLOW_NETWORK_TIMEOUT });
 
    } finally {
      // Tear down network throttling ──────────────────────
      // Ensures subsequent tests in the same worker are not affected even if
      // this test fails partway through
      await cdpSession.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 0,
        downloadThroughput: -1,   // -1 = no throttle
        uploadThroughput: -1,
      });
      await cdpSession.detach();
    }
  });