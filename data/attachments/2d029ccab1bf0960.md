# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/pim/add-employee-validation.spec.ts >> PIM Module - Add Employee Form Validation >> TC_PIM_USER_ADD_028 | PIM | Add Employee | Invalid Employee ID format is rejected
- Location: tests/ui/regression/pim/add-employee-validation.spec.ts:478:3

# Error details

```
Error: Employee ID field should display Required error message

expect(locator).toBeVisible() failed

Locator: locator('.oxd-form .orangehrm-employee-form .oxd-input-group').filter({ hasText: 'Employee Id' }).locator('span.oxd-input-field-error-message').first()
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Employee ID field should display Required error message with timeout 60000ms
  - waiting for locator('.oxd-form .orangehrm-employee-form .oxd-input-group').filter({ hasText: 'Employee Id' }).locator('span.oxd-input-field-error-message').first()

```

# Test source

```ts
  430 |       // Quality / business area
  431 |       { type: 'epic', description: 'Functional' },
  432 | 
  433 |       // Functional hierarchy
  434 |       { type: 'feature', description: 'PIM' },
  435 |       { type: 'story', description: 'Add Employee' },
  436 | 
  437 |       // Suite grouping
  438 |       { type: 'suite', description: 'Create Employee Uniqueness Validation' },
  439 | 
  440 |       // Severity
  441 |       { type: 'severity', description: 'critical' },
  442 | 
  443 |       // Traceability
  444 |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_007' },
  445 | 
  446 |       // Human-readable intent
  447 |       {
  448 |         type: 'description',
  449 |         description:
  450 |           'Verifies that the system prevents creation of an employee record when a duplicate Employee ID is used and displays an appropriate uniqueness validation error.',
  451 |       },
  452 |     ],
  453 |   }, async ({adminUserAuthPage}) => {
  454 |      
  455 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  456 | 
  457 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  458 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  459 |     await navigationPage.navigateToPim();    
  460 | 
  461 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  462 |     await pimEmployeeListPage.navigateToAddEmployee();    
  463 | 
  464 |     // use existing test employee id to ensure that ID used is duplicate
  465 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  466 |     const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();    
  467 |     const currentTestEmployeeId = getTestEmployeeId(); //re-using test employee id (already added employee)
  468 |     await employeeIDInputLocator.fill(currentTestEmployeeId);
  469 | 
  470 |     await addEmployeePage.clickSave();
  471 |     await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
  472 |   });
  473 | 
  474 |    /**
  475 |    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_028
  476 |    * Verify if invalid Employee ID is reported as error while saving form  
  477 |    */
  478 |   test(
  479 |   'TC_PIM_USER_ADD_028 | PIM | Add Employee | Invalid Employee ID format is rejected',
  480 |   {
  481 |     tag: [
  482 |       '@smoke',
  483 |       '@regression',
  484 |       '@pim',
  485 |       '@employee',
  486 |       '@user-management',
  487 |       '@create-user',
  488 |       '@validation',
  489 |       '@negative-test',
  490 |       '@format-validation',
  491 |       '@known-bug',
  492 |       '@admin',
  493 |     ],
  494 |     annotation: [
  495 |       { type: 'epic', description: 'Functional' },
  496 |       { type: 'feature', description: 'PIM' },
  497 |       { type: 'story', description: 'Add Employee' },
  498 | 
  499 |       // Important: isolate bugged behavior cleanly
  500 |       { type: 'suite', description: 'Create Employee ID Format Validation' },
  501 | 
  502 |       { type: 'severity', description: 'high' },
  503 | 
  504 |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_028' },
  505 | 
  506 |       {
  507 |         type: 'description',
  508 |         description:
  509 |           'Verifies that the system rejects invalid Employee ID formats containing special characters and prevents form submission with appropriate validation error messages.',
  510 |       },
  511 |     ],
  512 |   }, async ({adminUserAuthPage}) => {
  513 |     test.slow();
  514 |     test.fail(true, 'Known bug in the app. Developers are to be notified');
  515 | 
  516 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  517 | 
  518 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  519 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  520 |     await navigationPage.navigateToPim();    
  521 | 
  522 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  523 |     await pimEmployeeListPage.navigateToAddEmployee();    
  524 |     
  525 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  526 |     const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();    
  527 |     await employeeIDInputLocator.fill('.@$./^&');//invalid junk
  528 |     await addEmployeePage.clickSave();
  529 |     
> 530 |     await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
      |                                                                                                                        ^ Error: Employee ID field should display Required error message
  531 |   });
  532 | });
  533 | 
  534 | 
```