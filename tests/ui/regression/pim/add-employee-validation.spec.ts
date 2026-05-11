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
  test(
  'TC_PIM_USER_ADD_001 | PIM | Add Employee | Mandatory field validation (basic)',
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

      // Suite grouping (keep lightweight separate from TC_029)
      { type: 'suite', description: 'Create Employee Basic Validation' },

      // Severity
      { type: 'severity', description: 'critical' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_001' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Add Employee form enforces mandatory field validation by displaying Required error messages when attempting to save without entering First Name and Last Name, and ensures the form is not submitted.',
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
  test(
  'TC_PIM_USER_ADD_002 | PIM | Add Employee | Partial submission validates missing mandatory fields',
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

      // Suite grouping
      { type: 'suite', description: 'Create Employee Partial Form Validation' },

      // Severity
      { type: 'severity', description: 'critical' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_002' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that submitting the Add Employee form with only First Name filled triggers validation errors for missing mandatory fields such as Last Name, and ensures the form is not submitted.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
     
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
  test(
  'TC_PIM_USER_ADD_003 | PIM | Add Employee | Middle Name does not trigger validation in partial submission',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@form-validation',
      '@optional-field',
      '@negative-test',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Optional Field Validation' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_003' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Middle Name field accepts input without triggering validation errors and does not affect form submission behavior when mandatory fields are missing.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
     
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
  test(
  'TC_PIM_USER_ADD_004 | PIM | Add Employee | Partial submission validates missing mandatory fields (Last Name only)',
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

      // Suite grouping
      { type: 'suite', description: 'Create Employee Partial Form Validation' },

      // Severity
      { type: 'severity', description: 'critical' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_004' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that submitting the Add Employee form with only Last Name filled triggers validation errors for missing mandatory fields such as First Name, and ensures the form is not submitted.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
     
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
  test(
  'TC_PIM_USER_ADD_005 | PIM | Add Employee | Employee ID is auto-generated on form load',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@default-values',
      '@form-initialization',
      '@auto-generated',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Default Field Initialization' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_005' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Employee ID field is automatically populated when the Add Employee form is loaded, ensuring system-generated identifiers are assigned without user input.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // check if employee id is populated
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    await expect(addEmployeePage.getEmployeeIDInput(), 'Employee ID is expected to be auto populated').not.toBeEmpty();
  });
  
  
  /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_006
   * Verifies that Employee ID that is auto populated is editable  
   */
  test(
  'TC_PIM_USER_ADD_006 | PIM | Add Employee | Employee ID field is editable',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@input-field',
      '@editability',
      '@default-values',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Field Behavior Validation' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_006' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the auto-generated Employee ID field remains editable, allowing users to modify the system-generated value before saving the employee record.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // check if employee id is updatable
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();
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
  test(
  'TC_PIM_USER_ADD_007 | PIM | Add Employee | Duplicate Employee ID is rejected',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@validation',
      '@negative-test',
      '@duplicate-check',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Uniqueness Validation' },

      // Severity
      { type: 'severity', description: 'critical' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_007' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the system prevents creation of an employee record when a duplicate Employee ID is used and displays an appropriate uniqueness validation error.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
     
    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    

    // use existing test employee id to ensure that ID used is duplicate
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();    
    const currentTestEmployeeId = getTestEmployeeId(); //re-using test employee id (already added employee)
    await employeeIDInputLocator.fill(currentTestEmployeeId);

    await addEmployeePage.clickSave();
    await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
  });

   /**
   * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_028
   * Verify if invalid Employee ID is reported as error while saving form  
   */
  test(
  'TC_PIM_USER_ADD_028 | PIM | Add Employee | Invalid Employee ID format is rejected',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@validation',
      '@negative-test',
      '@format-validation',
      '@known-bug',
      '@admin',
    ],
    annotation: [
      { type: 'epic', description: 'Functional' },
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Important: isolate bugged behavior cleanly
      { type: 'suite', description: 'Create Employee ID Format Validation' },

      { type: 'severity', description: 'high' },

      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_028' },

      {
        type: 'description',
        description:
          'Verifies that the system rejects invalid Employee ID formats containing special characters and prevents form submission with appropriate validation error messages.',
      },
    ],
  }, async ({adminUserAuthPage}) => {
    test.slow();
    test.fail(true, 'Known bug in the app. Developers are to be notified');

    await adminUserAuthPage.goto('/web/index.php/dashboard/index');    

    const navigationPage = new NavigationPage(adminUserAuthPage);
    await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
    await navigationPage.navigateToPim();    

    const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
    await pimEmployeeListPage.navigateToAddEmployee();    
    
    const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
    const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();    
    await employeeIDInputLocator.fill('.@$./^&');//invalid junk
    await addEmployeePage.clickSave();
    
    await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
  });
});

