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
    // Verify that field displays validation error
    await expect(usernameFieldError, 'User Name field should NOT display Required error message').not.toBeVisible();          
  });

})