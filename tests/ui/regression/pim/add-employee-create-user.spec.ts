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
  test('Verify new user login form is enabled by default but allows user to disable it', async ({ adminUserAuthPage, logger }) => {  
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
})