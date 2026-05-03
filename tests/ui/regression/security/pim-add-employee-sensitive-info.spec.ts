import { test, expect } from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { PimEmployeeListPage } from '../../../../pages/PimEmployeeListPage';
import { AddEmployeePage } from '../../../../pages/AddEmployeePage';

/**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_037
    * Verifies Password and Confirm Password fields mask input and are not displayed in plain text. It is in create user form.
 */
  test('Verifies Password and Confirm Password fields mask input and are not displayed in plain text', async ({ adminUserAuthPage }) => {
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar'    ).toBeVisible();
    await navigationPage.navigateToPim(); 
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect( pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation' ).toBeVisible();
    await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation' ).toBeVisible();
    await pimEmployeeListPage.navigateToAddEmployee(); 
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded').toBeVisible();
 
    await addEmployeePage.clickCreateLoginDetails();    
    // ── Masking assertions ────────────────────────────────────────────────────
    const passwordInput = addEmployeePage.getPasswordInput();
    const confirmPasswordInput = addEmployeePage.getConfirmPasswordInput();
 
    await expect( passwordInput, 'Password field should be visible after Create Login Details is toggled ON' ).toBeVisible();
    await expect( confirmPasswordInput, 'Confirm Password field should be visible after Create Login Details is toggled ON' ).toBeVisible();

    await expect( passwordInput, 'Password input must have type="password" — characters should be masked, not displayed in plain text' ).toHaveAttribute('type', 'password'); 
    await expect( confirmPasswordInput, 'Confirm Password input must have type="password" — characters should be masked, not displayed in plain text' ).toHaveAttribute('type', 'password'); 
  });
  
/**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_038
    * Verifies Browser console does not log sensitive information(password) in plain text during or after form submission.
 */
  test('Verifies if Browser console does not log password in plain text during or after form submission', async ({ adminUserAuthPage }) => {
 
    // ── Console listener — must be registered before any page interaction ─────
    // Captures ALL console message types: log, warn, error, debug, info
    const consoleMessages: string[] = [];
    adminUserAuthPage.on('console', (msg) => {
      consoleMessages.push(msg.text());
    });
 
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect( navigationPage.getPimNavItem(),'PIM navigation item should be visible in the left sidebar').toBeVisible();
    await navigationPage.navigateToPim();     
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect( pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation').toBeVisible();
    await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation' ).toBeVisible();
    await pimEmployeeListPage.navigateToAddEmployee(); 
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded' ).toBeVisible();
 
    await addEmployeePage.fillFirstName('John');
    await addEmployeePage.fillLastName('TestAuto'); 
    await addEmployeePage.clickCreateLoginDetails();
 
    const uniqueUsername = `test_user_${Date.now()}`;//unique number given by Date.now()
    await addEmployeePage.fillUserName(uniqueUsername); 
    const testPassword = 'Test@Pass1';
    await addEmployeePage.fillPassword(testPassword);
    await addEmployeePage.fillConfirmPassword(testPassword);     
    await addEmployeePage.clickSave();
 
    // Wait for redirect — confirms form was actually submitted before scanning console
    await expect(
      adminUserAuthPage,
      'Form should redirect to employee profile page confirming successful submission'
    ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
 
    // ── Console password leak assertions ──────────────────────────────────────
    // Filter collected messages to find any that contain the plain-text password. Case insenstive filtering
    const messagesWithPassword = consoleMessages.filter((msg) =>
      msg.toLowerCase().includes(testPassword.toLowerCase())
    );
 
    // Attach the captured console log to the test report for diagnostics —
    // visible in Playwright HTML report even on pass, invaluable on failure
    await test.info().attach('browser-console-output', {
      body: consoleMessages.length > 0
        ? consoleMessages.join('\n')
        : '(no console messages captured)',
      contentType: 'text/plain',
    });
 
     expect(messagesWithPassword,  `Browser console should NOT contain the plain-text password. Found ${messagesWithPassword.length} message(s) with password value:\n` + messagesWithPassword.join('\n') ).toHaveLength(0);
  });