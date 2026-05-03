import { test, expect, Locator } from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { PimEmployeeListPage } from '../../../../pages/PimEmployeeListPage';
import { AddEmployeePage } from '../../../../pages/AddEmployeePage';

test.describe('PIM - Add Employee: with new user form validation', () => {
  /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_014
    * verifies if add employee form also allows to create user on the same page. FYI, One employee can have many user logins
 */
  test('Admin can add a new employee along with user login. Verify user form being shown', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();

    const userNameLabel: Locator = addEmployeePage.getLabelInCreateLoginForm('Username');
    await expect(userNameLabel).toBeVisible();

    const passwordLabel: Locator = addEmployeePage.getLabelInCreateLoginForm('Password');
    await expect(passwordLabel).not.toHaveCount(0);
  });

   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_016
    * verifies create user form has username and password fields are mandatory
 */
  test('Verify user form fields are username and password are required', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();
    await addEmployeePage.clickSaveWithoutFillingForm();

    const usernameFieldError = addEmployeePage.getUsernameFieldError();
    const passwordFieldErrpr = addEmployeePage.getPasswordFieldError();
    // Verify that field displays validation error
    await expect(usernameFieldError, 'User Name field should display Required error message').toBeVisible();  
    await expect(passwordFieldErrpr, 'Password field should display Required error message').not.toHaveCount(0);  //covers both password and confirm password
  });
  
   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_017
    * verifies create user form accepts valid username 
 */
  test('Verify username accepts valid value in user form fields', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();

    await addEmployeePage.fillUserName('User_JohnTest');
    await addEmployeePage.clickSave();

    const usernameFieldError = addEmployeePage.getUsernameFieldError();    
    // Verify that field does NOT display validation error
    await expect(usernameFieldError, 'User Name field should NOT display Required error message').not.toBeVisible();          
  });

   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_018
    * verifies create user form reject duplicate username 
 */
  test('Verify username rejects duplicate user if provided in user form fields', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();

    await addEmployeePage.fillUserName(process.env.ess_user_name ?? 'Admin');
    await addEmployeePage.clickSave();

    const usernameFieldError = addEmployeePage.getUsernameFieldError();    
    // Verify that field displays validation error
    await expect(usernameFieldError, 'User Name field should display duplicate user error message').toBeVisible();      
  });

   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_019
    * verifies create user form login status is enabled
 */
  test('Verify new user login form is enabled by default', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();
    
    const loginFormStatusInput = addEmployeePage.getLoginStatusInputBy('Enabled');
   
    await expect(loginFormStatusInput, 'In User form, status is NOT enabled by default').toBeChecked();      
  });
  
   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_020
    * Verify if the form allow user login status to disabled
 */
  test('Verify new user login form is enabled by default but allows user to disable it', async ({ adminUserAuthPage}) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();
    
    const loginFormStatusInputEnabled = addEmployeePage.getLoginStatusInputBy('Enabled');
   
    await expect(loginFormStatusInputEnabled, 'In User form, status is NOT enabled by default').toBeChecked();    
    const loginFormStatusInputDisabled = addEmployeePage.getLoginStatusInputBy('Disabled');  
    
    await loginFormStatusInputDisabled.focus();
    await adminUserAuthPage.keyboard.press('Space');

    await expect(loginFormStatusInputEnabled, 'In User form, status should NOT be enabled after clicking on disabled').not.toBeChecked();    
  });
  
   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_021
    * verifies passowrd and confirm password field values are matching. It is in create user form.
 */
  test('Verify user form fields password and confirm passowrd are matching', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();
    const testPassword = 'password@123';
    await addEmployeePage.fillPassword(testPassword);
    await addEmployeePage.fillConfirmPassword(testPassword);
    await addEmployeePage.clickSave();
    
    const confirmPasswordFieldErrpr = addEmployeePage.getConfirmPasswordFieldError();
    // Verify that field does NOT displays validation error
    await expect(confirmPasswordFieldErrpr, 'User Name field should display Required error message').not.toBeVisible();        
  });
  
   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_022
    * verifies error when passowrd and confirm password field values are not matching. It is in create user form.
 */
  test('Verify user error when form fields password and confirm passowrd are not matching', async ({ adminUserAuthPage }) => {  
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    
    await addEmployeePage.clickCreateLoginDetails();
    const testPassword = 'password@123';
    await addEmployeePage.fillPassword(testPassword);
    await addEmployeePage.fillConfirmPassword(testPassword + '4');//not using same password string
    await addEmployeePage.clickSave();
    
    const confirmPasswordFieldErrpr = addEmployeePage.getConfirmPasswordFieldError();
    // Verify that field does NOT displays validation error
    await expect(confirmPasswordFieldErrpr, 'User Name field should display Required error message').toBeVisible();          
  });

   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_024
    * verifies error when passowrd and confirm password field values are not matching. It is in create user form.
 */
  test('Verify Successful creation of add new employee along with login credentials', async ({ adminUserAuthPage }) => {
 
    await adminUserAuthPage.goto('/web/index.php/dashboard/index'); 
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar').toBeVisible();
 
    await navigationPage.navigateToPim(); 
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation').toBeVisible();
    await expect(pimEmployeeListPage.getAddEmployeeButton(),'Add Employee button should be visible in the top navigation').toBeVisible();
    await pimEmployeeListPage.navigateToAddEmployee();
 
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect(addEmployeePage.getSaveButton(),'Save button should be visible confirming the Add Employee form is loaded').toBeVisible();
 
    // Fill mandatory name fields
    await addEmployeePage.fillFirstName('John');
    await addEmployeePage.fillLastName('TestAuto');
    await addEmployeePage.clickCreateLoginDetails(); 
    // Username must be unique per run to avoid TC_PIM_USER_ADD_018 duplicate error
    const uniqueUsername = `test_user_${Date.now()}`;//Date.now() returns a long unique number
    await addEmployeePage.fillUserName(uniqueUsername); 
    // Password: meets OrangeHRM strong password requirement (upper + lower + symbol + number)
    const testPassword = 'Test@Pass1';
    await addEmployeePage.fillPassword(testPassword);
    await addEmployeePage.fillConfirmPassword(testPassword);
 
    // Verify status radio defaults to Enabled before submitting
    const loginStatusEnabled = addEmployeePage.getLoginStatusInputBy('Enabled');
    await expect(loginStatusEnabled, 'Login Status should default to Enabled before form submission').toBeChecked();
 
    await addEmployeePage.clickSave();
 
    // ── Post-save assertions ────────────────────────────────────────────────── 
    await expect( addEmployeePage.getFirstNameFieldError(), 'First Name field should NOT display a validation error after successful save' ).not.toBeVisible(); 
    await expect( addEmployeePage.getLastNameFieldError(), 'Last Name field should NOT display a validation error after successful save'
    ).not.toBeVisible(); 
    await expect( addEmployeePage.getUsernameFieldError(), 'Username field should NOT display a validation error after successful save').not.toBeVisible(); 
    await expect(addEmployeePage.getPasswordFieldError(), 'Password field should NOT display a validation error after successful save' ).not.toBeVisible(); 
    await expect(addEmployeePage.getConfirmPasswordFieldError(), 'Confirm Password field should NOT display a validation error after successful save').not.toBeVisible();
 
    // Successful save redirects to the employee profile page
    await expect(adminUserAuthPage,'URL should change to the employee profile page after a successful save, confirming the record was created'
    ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  });

   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_024
    * Verify Cancel button discards invalid form data and returns to Employee List. It is in create user form.
 */
 test('Verify Cancel button discards invalid form data and returns to Employee List', async ({ adminUserAuthPage }) => {
 
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar').toBeVisible();
 
    await navigationPage.navigateToPim();
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect( pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation').toBeVisible(); 
    await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation').toBeVisible();
 
    await pimEmployeeListPage.navigateToAddEmployee();
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded').toBeVisible();
 
    await addEmployeePage.clickCreateLoginDetails(); 
    // Enter a known-duplicate username — 'Admin' always exists in OrangeHRM demo
    await addEmployeePage.fillUserName(process.env.ess_user_name ?? 'Admin'); 
    // Enter mismatched passwords (client-side mismatch violation)
    await addEmployeePage.fillPassword('Test@Pass1');
    await addEmployeePage.fillConfirmPassword('Test@Pass1_MISMATCH');
 
    // Confirm the Cancel button is reachable before acting on it
    await expect(addEmployeePage.getCancelButton(), 'Cancel button should be visible on the Add Employee form').toBeVisible(); 
    await addEmployeePage.clickCancel();
 
    // ── Post-cancel assertions ──────────────────────────────────────────────── 
    // URL must resolve to the Employee List page — not stay on addEmployee
    await expect(adminUserAuthPage, 'Cancel should navigate away from the Add Employee form to the Employee List page').toHaveURL(/\/pim\/viewEmployeeList/); 
  });


   /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_029
    * verifies All mandatory fields show Required error when Save is clicked without any input. It is in create user form.
 */
  test('Verify All mandatory fields show Required error when Save is clicked without any input', async ({ adminUserAuthPage }) => {
 
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar').toBeVisible();
 
    await navigationPage.navigateToPim();
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect( pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation').toBeVisible();
    await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation' ).toBeVisible();
 
    await pimEmployeeListPage.navigateToAddEmployee();
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded').toBeVisible();
 
    await addEmployeePage.clickCreateLoginDetails();
    await addEmployeePage.clickSaveWithoutFillingForm();
 
    await expect( addEmployeePage.getFirstNameFieldError(), 'First Name field should display a Required error message' ).toBeVisible();
    await expect( addEmployeePage.getLastNameFieldError(),  'Last Name field should display a Required error message'  ).toBeVisible();
    await expect( addEmployeePage.getUsernameFieldError(),  'Username field should display a Required error message'  ).toBeVisible();
    await expect( addEmployeePage.getPasswordFieldError(),  'Password field should display a Required error message'  ).toBeVisible();
    await expect( addEmployeePage.getConfirmPasswordFieldError(), 'Confirm Password field should display a Required error message' ).toBeVisible(); 
    // ── Form was NOT submitted ────────────────────────────────────────────────
    await expect( adminUserAuthPage,'URL should remain on the Add Employee form page — form should not have been submitted' ).toHaveURL(/\/pim\/addEmployee/);
  });

 /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_033
    * Verifies Browser Back button discards invalid form data and returns to Employee List.
 */
  test('Verifies Browser Back button discards invalid form data and returns to Employee List', async ({ adminUserAuthPage }) => {
 
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar' ).toBeVisible();
 
    await navigationPage.navigateToPim(); 
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation'
    ).toBeVisible(); 
    await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in top navigation').toBeVisible();
 
    await pimEmployeeListPage.navigateToAddEmployee();
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded').toBeVisible();
 
    // Intentionally leave First Name and Last Name empty (mandatory field violation)
    await addEmployeePage.clickCreateLoginDetails();
    await addEmployeePage.fillUserName(process.env.ess_user_name ?? 'Admin');
    await addEmployeePage.fillPassword('Test@Pass1');
    await addEmployeePage.fillConfirmPassword('Test@Pass1_MISMATCH'); 
    // ── Browser Back button ───────────────────────────────────────────────────
    await adminUserAuthPage.goBack();
 
    // ── Post-navigation assertions ──────────────────────────────────────────── 
    // URL must resolve to the Employee List page — not stay on addEmployee
    await expect(adminUserAuthPage, 'Browser Back should navigate away from the Add Employee form to the Employee List page' ).toHaveURL(/\/pim\/viewEmployeeList/);
  });


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
})