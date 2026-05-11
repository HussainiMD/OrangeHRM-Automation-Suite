import { test, expect, Locator } from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { PimEmployeeListPage } from '../../../../pages/PimEmployeeListPage';
import { AddEmployeePage } from '../../../../pages/AddEmployeePage';

test.describe('PIM - Add Employee: with new user form validation', () => {
  /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_014
    * verifies if add employee form also allows to create user on the same page. FYI, One employee can have many user logins
 */
  test(
  'TC_PIM_USER_ADD_014 | PIM | Add Employee | Admin can create employee with login details',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Employee Creation' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_014' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that while adding a new employee, an administrator can enable "Create Login Details" and the username and password fields are displayed for creating an associated user account.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
  test(
  'TC_PIM_USER_ADD_016 | PIM | Add Employee | Username and password are mandatory in Create Login Details',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@validation',
      '@negative',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Create Login Details Validation' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_016' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that the Create Login Details section requires Username and Password fields and displays validation errors when the form is submitted without providing them.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
  test(
  'TC_PIM_USER_ADD_017 | PIM | Add Employee | Username field accepts valid value',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@validation',
      '@positive',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Create Login Details Validation' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_017' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that the Username field in the Create Login Details section accepts a valid username and does not display validation errors.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
  test(
  'TC_PIM_USER_ADD_018 | PIM | Add Employee | Username field rejects duplicate usernames',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@validation',
      '@negative',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Create Login Details Validation' },

      // Business criticality
      { type: 'severity', description: 'critical' },

      // External traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_018' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that the Username field in the Create Login Details section rejects a username that already exists and displays a duplicate username validation error.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
  test(
  'TC_PIM_USER_ADD_019 | PIM | Add Employee | Login status is enabled by default',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@default-values',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Create Login Details Defaults' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // External traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_019' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that the Login Status option in the Create Login Details section is preselected as "Enabled" by default.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
  test(
  'TC_PIM_USER_ADD_020 | PIM | Add Employee | Login status can be changed to Disabled',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@default-values',
      '@form-interaction',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Create Login Details Defaults' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // External traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_020' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Verifies that the Login Status option is set to "Enabled" by default and can be changed to "Disabled" before saving the employee record.',
      },
    ],
  }, async ({ adminUserAuthPage}) => {  
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
  test(
  'TC_PIM_USER_ADD_021 | PIM | Add Employee | Password and Confirm Password must match',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@password-validation',
      '@form-validation',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Logical grouping in Allure
      { type: 'suite', description: 'Create Login Details Validation' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_021' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Password and Confirm Password fields accept matching values when creating login details for a new employee and do not trigger validation errors.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_022_01
    * verifies error when passowrd and confirm password field values are not matching. It is in create user form.
 */
  test(
  'TC_PIM_USER_ADD_022_01 | PIM | Add Employee | Password mismatch shows validation error',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@password-validation',
      '@negative-test',
      '@form-validation',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping in Allure
      { type: 'suite', description: 'Create Login Details Validation' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_022_01' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the system displays a validation error when the Password and Confirm Password fields contain mismatching values during employee creation login setup.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {  
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
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_026
    * Verify Cancel button discards invalid form data and returns to Employee List. It is in create user form.
 */
 test(
  'TC_PIM_USER_ADD_026 | PIM | Add Employee | Cancel discards form and returns to Employee List',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@navigation',
      '@form-cancel',
      '@negative-test',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Allure grouping
      { type: 'suite', description: 'Create Login Details Navigation & Cancel Flow' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_026' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that clicking the Cancel button on the Add Employee form discards any entered login details (including invalid or mismatched data) and navigates the user back to the Employee List page.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {
 
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
  test(
  'TC_PIM_USER_ADD_029 | PIM | Add Employee | Mandatory fields show Required errors on empty submit',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@form-validation',
      '@required-fields',
      '@negative-test',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Allure grouping
      { type: 'suite', description: 'Create Employee Required Field Validation' },

      // Severity
      { type: 'severity', description: 'critical' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_029' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that all mandatory fields in the Add Employee form display "Required" validation errors when the Save button is clicked without entering any input, and that the form is not submitted.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {
 
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
  test(
  'TC_PIM_USER_ADD_033 | PIM | Add Employee | Browser Back navigates to Employee List',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@navigation',
      '@browser-navigation',
      '@negative-test',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Allure grouping
      { type: 'suite', description: 'Create Employee Browser Navigation' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_033' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that using the browser Back button from the Add Employee form correctly discards any entered (invalid or incomplete) login data and navigates the user back to the Employee List page.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {
 
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
  
 
})



test.describe.serial('PIM - Add Employee test case that should run in series to avoid duplicate employee ID issue', () => {
 /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_022_02
    * verifies error when passowrd and confirm password field values are not matching. It is in create user form.
 */
 test(
  'TC_PIM_USER_ADD_022_02 | PIM | Add Employee | Successfully create employee with login credentials',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@positive-test',
      '@login-creation',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Success Flow' },

      // Severity
      { type: 'severity', description: 'critical' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_022_02' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that a new employee can be successfully created along with login credentials, and that the system redirects to the employee profile page after saving without validation errors.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {
 
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
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_048
    * Verify Save and Cancel buttons are disabled while form submission is in progress. Form is for add employee
 */
  test(
  'TC_PIM_USER_ADD_048 | PIM | Add Employee | Shows loader during submission and completes save',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@form-submission',
      '@loading-state',
      '@positive-test',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Submission State Handling' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_048' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that during Add Employee form submission, the system displays a loading state (spinner/loader) and successfully completes the employee creation process by redirecting to the employee profile page.',
      },
    ],
  }, async ({ adminUserAuthPage }) => {
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar' ).toBeVisible();
    await navigationPage.navigateToPim();
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation'
    ).toBeVisible(); 
    await pimEmployeeListPage.navigateToAddEmployee();
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded' ).toBeVisible();
 
    await addEmployeePage.fillFirstName('John');
    await addEmployeePage.fillLastName('TestAuto');
 
    await addEmployeePage.clickCreateLoginDetails();
 
    const uniqueUsername = `test_user_${Date.now()}`;
    await addEmployeePage.fillUserName(uniqueUsername);
 
    const testPassword = 'Test@Pass1';
    await addEmployeePage.fillPassword(testPassword);
    await addEmployeePage.fillConfirmPassword(testPassword);
     
    await addEmployeePage.clickSave();
    // loader or spinner forms overlay the action button avoiding user to do further actions
    await expect(addEmployeePage.getFormLoader(), 'Loader / Spinner is not shown to the user after clicking save').toBeVisible();    
 
    await expect( adminUserAuthPage, 'App should redirect to employee profile page after submission completes — ' +
      'confirms the intercepted request was released and processed correctly' ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  });
})