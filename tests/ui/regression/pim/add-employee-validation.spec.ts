import { test, expect } from "../../../../fixtures/admin-auth.fixture";
import { AddEmployeePage } from "../../../../pages/AddEmployeePage";
import { PimEmployeeListPage } from "../../../../pages/PimEmployeeListPage";
import { NavigationPage } from "../../../../pages/NavigationPage";

test.describe("PIM Module - Add Employee Form Validation", () => {
  /**
 * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_001
 * verifies if add employee form checks mandatory data inputs
 */
  test("TC_PIM_USER_ADD_001 - Add New User Form Validation", async ({ adminUserAuthPage }) => {
    const page = adminUserAuthPage;

    await page.goto('/web/index.php/dashboard/index');
    
    const navigationPage = new NavigationPage(page);
    await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
    
    await navigationPage.navigateToPim();
    
    const pimEmployeeListPage = new PimEmployeeListPage(page);
    await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
    
    await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
    
    await pimEmployeeListPage.navigateToAddEmployee();
    
    const addEmployeePage = new AddEmployeePage(page);
    await expect(addEmployeePage.getSaveButton(), "Save button should be visible to confirm form loaded").toBeVisible();
    
    await addEmployeePage.clickSaveWithoutFillingForm();
    
    await expect(addEmployeePage.getFirstNameFieldError(), "First Name field should display Required error message").toBeVisible();
    
    await expect(addEmployeePage.getLastNameFieldError(), "Last Name field should display Required error message").toBeVisible();

    await expect(addEmployeePage.getSaveButton(), "Form should still be visible after failed validation - form was not submitted").toBeVisible();

    await expect(page, "URL should remain on Add Employee form page indicating form was not submitted").toHaveURL(/\/pim\/addEmployee/);    
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
  test("TC_PIM_USER_ADD_002 - Add New User Form Validation - Verify Middle Name field accepts valid entry", async ({adminUserAuthPage}) => {
     
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
});

