# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/resilience/pim-add-employee-slow-network.spec.ts >> TC_PIM_USER_ADD_040 | PIM | Add Employee | Works under Slow 3G network conditions
- Location: tests/ui/regression/resilience/pim-add-employee-slow-network.spec.ts:31:3

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: cdpSession.send: Target page, context or browser has been closed
```

# Test source

```ts
  24  | // Slow 3G adds ~400 ms latency per request on top of normal page load time.
  25  | const SLOW_NETWORK_TIMEOUT = 30_000;
  26  | 
  27  | /**
  28  |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_040
  29  |     * Verify Add Employee with credentials succeeds under Slow 3G network conditions.
  30  |  */
  31  |   test(
  32  |   'TC_PIM_USER_ADD_040 | PIM | Add Employee | Works under Slow 3G network conditions',
  33  |   {
  34  |     tag: [
  35  |       '@regression',
  36  |       '@pim',
  37  |       '@employee',
  38  |       '@network',
  39  |       '@performance-lite',
  40  |       '@slow-network',
  41  |       '@resilience',
  42  |       '@critical-path',
  43  |     ],
  44  |     annotation: [
  45  |       { type: 'epic', description: 'System Resilience' },
  46  |       { type: 'feature', description: 'PIM' },
  47  |       { type: 'story', description: 'Add Employee under Network Constraints' },
  48  | 
  49  |       { type: 'suite', description: 'Network Condition Compatibility Tests' },
  50  | 
  51  |       { type: 'severity', description: 'high' },
  52  | 
  53  |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_040' },
  54  | 
  55  |       {
  56  |         type: 'description',
  57  |         description:
  58  |           'Verifies that the Add Employee workflow remains functional under Slow 3G network conditions using CDP-based network throttling, ensuring form submission and navigation complete successfully despite degraded network performance.',
  59  |       },
  60  |     ],
  61  |   }, async ({ adminUserAuthPage, browserName, logger }) => {
  62  |  
  63  |     // Skip non-Chromium browsers. CDP network throttling is a Chromium-only API. 
  64  |     if (browserName !== 'chromium') {
  65  |       const msg: string = `Network throttling via CDP is only supported in Chromium. Current browser: ${browserName}. Skipping this test.`;
  66  |       logger.warn(msg);
  67  |       test.skip(true, msg);
  68  |     }
  69  |  
  70  |     //Open CDP session and emulate Slow 3G ─────────────────────────
  71  |     const cdpSession = await adminUserAuthPage.context().newCDPSession(adminUserAuthPage);
  72  |     await cdpSession.send('Network.enable');
  73  |     await cdpSession.send('Network.emulateNetworkConditions', SLOW_3G);
  74  |  
  75  |     try {
  76  |       await adminUserAuthPage.goto('/web/index.php/dashboard/index'); 
  77  |       const navigationPage = new NavigationPage(adminUserAuthPage);
  78  |       await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar' ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT });
  79  |  
  80  |       await navigationPage.navigateToPim();
  81  |       const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  82  |       await expect( pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation'
  83  |       ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT }); 
  84  |       await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation'
  85  |       ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT });
  86  |  
  87  |       await pimEmployeeListPage.navigateToAddEmployee(); 
  88  |       const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
  89  |       await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded'
  90  |       ).toBeVisible({ timeout: SLOW_NETWORK_TIMEOUT });
  91  |  
  92  |       await addEmployeePage.fillFirstName('John');
  93  |       await addEmployeePage.fillLastName('TestAuto');
  94  |  
  95  |       await addEmployeePage.clickCreateLoginDetails();
  96  |  
  97  |       const uniqueUsername = `test_user_${Date.now()}`;
  98  |       await addEmployeePage.fillUserName(uniqueUsername);
  99  |  
  100 |       const testPassword = 'Test@Pass1';
  101 |       await addEmployeePage.fillPassword(testPassword);
  102 |       await addEmployeePage.fillConfirmPassword(testPassword);
  103 |       await addEmployeePage.clickSave();
  104 |  
  105 |       // No field validation errors ───────────────────────────────
  106 |       await expect( addEmployeePage.getFirstNameFieldError(), 'First Name field should NOT display a validation error after successful save'
  107 |       ).not.toBeVisible(); 
  108 |       await expect( addEmployeePage.getLastNameFieldError(), 'Last Name field should NOT display a validation error after successful save'
  109 |       ).not.toBeVisible(); 
  110 |       await expect( addEmployeePage.getUsernameFieldError(), 'Username field should NOT display a validation error after successful save'
  111 |       ).not.toBeVisible(); 
  112 |       await expect( addEmployeePage.getPasswordFieldError(), 'Password field should NOT display a validation error after successful save'
  113 |       ).not.toBeVisible(); 
  114 |       await expect( addEmployeePage.getConfirmPasswordFieldError(), 'Confirm Password field should NOT display a validation error after successful save' ).not.toBeVisible();
  115 |  
  116 |       //Redirect confirms server persisted the record ────────────
  117 |       await expect( adminUserAuthPage, 'URL should change to employee profile page after successful save under Slow 3G — ' +
  118 |         'confirms the server round-trip completed despite throttled network' ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/, { timeout: SLOW_NETWORK_TIMEOUT });
  119 |  
  120 |     } finally {
  121 |       // Tear down network throttling ──────────────────────
  122 |       // Ensures subsequent tests in the same worker are not affected even if
  123 |       // this test fails partway through
> 124 |       await cdpSession.send('Network.emulateNetworkConditions', {
      |                        ^ Error: cdpSession.send: Target page, context or browser has been closed
  125 |         offline: false,
  126 |         latency: 0,
  127 |         downloadThroughput: -1,   // -1 = no throttle
  128 |         uploadThroughput: -1,
  129 |       });
  130 |       await cdpSession.detach();
  131 |     }
  132 |   });
```