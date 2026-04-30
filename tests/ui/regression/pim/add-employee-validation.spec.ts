import { test, expect, Locator } from "../../../../fixtures/admin-auth.fixture";
import { AddEmployeePage } from "../../../../pages/AddEmployeePage";
import { PimEmployeeListPage } from "../../../../pages/PimEmployeeListPage";
import { NavigationPage } from "../../../../pages/NavigationPage";
import { getTestEmployeeId } from "../../../../utils/users-manager.util";

test.describe("PIM Module - Add Employee Form Validation", () => {
  /**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_001
 * verifies if add employee form checks mandatory data inputs
 */
  test("TC_PIM_USER_ADD_001 - Add New User Form Validation", async ({ adminUserAuthPage }) => {
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    await expect(addEmployeePage.getSaveButton(), "Save button should be visible to confirm form loaded").toBeVisible();
    
    await addEmployeePage.clickSaveWithoutFillingForm();
    
    await expect(addEmployeePage.getFirstNameFieldError(), "First Name field should display Required error message").toBeVisible();
    
    await expect(addEmployeePage.getLastNameFieldError(), "Last Name field should display Required error message").toBeVisible();

    await expect(addEmployeePage.getSaveButton(), "Form should still be visible after failed validation - form was not submitted").toBeVisible();

    await expect(adminUserAuthPage, "URL should remain on Add Employee form page indicating form was not submitted").toHaveURL(/\/pim\/addEmployee/);    
  });

  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_002
   * Verifies that First Name field accepts valid entry and no error is displayed
   * when attempting to submit with only First Name filled
   */
  test("TC_PIM_USER_ADD_002 - Add New User Form Validation - Verify First Name field accepts valid entry", async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // Fill First Name with valid entry
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    const validFirstName = 'JohnTest';
    await addEmployeePage.fillFirstName(validFirstName);    
      
    await addEmployeePage.clickSave();
    const firstNameFieldError = addEmployeePage.getFirstNameFieldError();
    await expect(firstNameFieldError, 'Error message should not be displayed for First Name field').not.toBeVisible();    
    await expect(adminUserAuthPage, 'Form should not be submitted - URL should remain on Add Employee page').toHaveURL(/\/pim\/addEmployee/);    

    // Verify that Last Name field displays validation error
    await expect(addEmployeePage.getLastNameFieldError(), 'Last Name field should display Required error message').toBeVisible();    
  });
  
  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_003
   * Verifies that middle Name field accepts valid entry and no error is displayed
   * when attempting to submit with only First Name filled
   */
  test("TC_PIM_USER_ADD_003 - Add New User Form Validation - Verify Middle Name field accepts valid entry", async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // Fill Middle Name with valid entry
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    const validName = 'midTest';
    await addEmployeePage.fillMidName(validName);    
      
    await addEmployeePage.clickSave();
    const midNameFieldError = addEmployeePage.getMidNameFieldError();
    await expect(midNameFieldError, 'Error message should not be displayed for Middle Name field').not.toBeVisible();    
    await expect(adminUserAuthPage, 'Form should not be submitted - URL should remain on Add Employee page').toHaveURL(/\/pim\/addEmployee/);    
    
  });
  
  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_004
   * Verifies that Last Name field accepts valid entry and no error is displayed
   * when attempting to submit with only Last Name filled
   */
  test("TC_PIM_USER_ADD_004 - Add New User Form Validation - Verify Last Name field accepts valid entry", async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // Fill Last Name with valid entry
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
    const validName = 'SmithTest';
    await addEmployeePage.fillLastName(validName);    
      
    await addEmployeePage.clickSave();
    const lastNameFieldError = addEmployeePage.getLastNameFieldError();
    await expect(lastNameFieldError, 'Error message should not be displayed for Last Name field').not.toBeVisible();    
    await expect(adminUserAuthPage, 'Form should not be submitted - URL should remain on Add Employee page').toHaveURL(/\/pim\/addEmployee/);    

    // Verify that First Name field displays validation error
    await expect(addEmployeePage.getFirstNameFieldError(), 'First Name field should display Required error message').toBeVisible();    
  });

  
  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_005
   * Verifies that Employee ID is auto populated with add employee form is loaded   
   */
  test("TC_PIM_USER_ADD_005 - Add New User Form Validation - Verify Employee ID is auto-populated", async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // check if employee id is populated
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    await expect(addEmployeePage.getEmployeeID(), 'Employee ID is expected to be auto populated').not.toBeEmpty();
  });
  
  
  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_006
   * Verifies that Employee ID that is auto populated is editable  
   */
  test("TC_PIM_USER_ADD_006 - Add New User Form Validation - Verify auto populated Employee ID field is editable", async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // check if employee id is updatable
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeID();
    const currentEmployeeID = await employeeIDInputLocator.inputValue();    
    //imitate user clicking an pressing key on keyboard
    await employeeIDInputLocator.click();
    await adminUserAuthPage.keyboard.press('9');
    await expect(employeeIDInputLocator, 'Employee ID input field is NOT editable').not.toHaveValue(currentEmployeeID);
  });
  
  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_007
   * Verify if duplicate Employee ID is reported as error while saving form  
   */
  test("TC_PIM_USER_ADD_007 - Add New User Form Validation - Verify duplicate Employee ID is rejected", async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // use existing test employee id to ensure that ID used is duplicate
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeID();    
    const currentTestEmployeeId = getTestEmployeeId(); //re-using test employee id (already added employee)
    await employeeIDInputLocator.fill(currentTestEmployeeId);

    await addEmployeePage.clickSave();
    await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
  });
});

