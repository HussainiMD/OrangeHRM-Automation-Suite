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
});
