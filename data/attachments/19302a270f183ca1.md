# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/pim/add-employee-validation.spec.ts >> PIM Module - Add Employee Form Validation >> TC_PIM_USER_ADD_007 - Add New User Form Validation - Verify duplicate Employee ID is rejected
- Location: tests/ui/regression/pim/add-employee-validation.spec.ts:180:3

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
  98  |   
  99  |   /**
  100 |    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_004
  101 |    * Verifies that Last Name field accepts valid entry and no error is displayed
  102 |    * when attempting to submit with only Last Name filled
  103 |    */
  104 |   test("TC_PIM_USER_ADD_004 - Add New User Form Validation - Verify Last Name field accepts valid entry", async ({adminUserAuthPage}) => {
  105 |      
  106 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  107 | 
  108 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  109 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  110 |     await navigationPage.navigateToPim();    
  111 | 
  112 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  113 |     await pimEmployeeListPage.navigateToAddEmployee();    
  114 | 
  115 |     // Fill Last Name with valid entry
  116 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
  117 |     const validName = 'SmithTest';
  118 |     await addEmployeePage.fillLastName(validName);    
  119 |       
  120 |     await addEmployeePage.clickSave();
  121 |     const lastNameFieldError = addEmployeePage.getLastNameFieldError();
  122 |     await expect(lastNameFieldError, 'Error message should not be displayed for Last Name field').not.toBeVisible();    
  123 |     await expect(adminUserAuthPage, 'Form should not be submitted - URL should remain on Add Employee page').toHaveURL(/\/pim\/addEmployee/);    
  124 | 
  125 |     // Verify that First Name field displays validation error
  126 |     await expect(addEmployeePage.getFirstNameFieldError(), 'First Name field should display Required error message').toBeVisible();    
  127 |   });
  128 | 
  129 |   
  130 |   /**
  131 |    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_005
  132 |    * Verifies that Employee ID is auto populated with add employee form is loaded   
  133 |    */
  134 |   test("TC_PIM_USER_ADD_005 - Add New User Form Validation - Verify Employee ID is auto-populated", async ({adminUserAuthPage}) => {
  135 |      
  136 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  137 | 
  138 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  139 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  140 |     await navigationPage.navigateToPim();    
  141 | 
  142 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  143 |     await pimEmployeeListPage.navigateToAddEmployee();    
  144 | 
  145 |     // check if employee id is populated
  146 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  147 |     await expect(addEmployeePage.getEmployeeIDInput(), 'Employee ID is expected to be auto populated').not.toBeEmpty();
  148 |   });
  149 |   
  150 |   
  151 |   /**
  152 |    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_006
  153 |    * Verifies that Employee ID that is auto populated is editable  
  154 |    */
  155 |   test("TC_PIM_USER_ADD_006 - Add New User Form Validation - Verify auto populated Employee ID field is editable", async ({adminUserAuthPage}) => {
  156 |      
  157 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  158 | 
  159 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  160 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  161 |     await navigationPage.navigateToPim();    
  162 | 
  163 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  164 |     await pimEmployeeListPage.navigateToAddEmployee();    
  165 | 
  166 |     // check if employee id is updatable
  167 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  168 |     const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();
  169 |     const currentEmployeeID = await employeeIDInputLocator.inputValue();    
  170 |     //imitate user clicking an pressing key on keyboard
  171 |     await employeeIDInputLocator.click();
  172 |     await adminUserAuthPage.keyboard.press('9');
  173 |     await expect(employeeIDInputLocator, 'Employee ID input field is NOT editable').not.toHaveValue(currentEmployeeID);
  174 |   });
  175 |   
  176 |   /**
  177 |    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_007
  178 |    * Verify if duplicate Employee ID is reported as error while saving form  
  179 |    */
  180 |   test("TC_PIM_USER_ADD_007 - Add New User Form Validation - Verify duplicate Employee ID is rejected", async ({adminUserAuthPage}) => {
  181 |      
  182 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  183 | 
  184 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  185 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  186 |     await navigationPage.navigateToPim();    
  187 | 
  188 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  189 |     await pimEmployeeListPage.navigateToAddEmployee();    
  190 | 
  191 |     // use existing test employee id to ensure that ID used is duplicate
  192 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  193 |     const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();    
  194 |     const currentTestEmployeeId = getTestEmployeeId(); //re-using test employee id (already added employee)
  195 |     await employeeIDInputLocator.fill(currentTestEmployeeId);
  196 | 
  197 |     await addEmployeePage.clickSave();
> 198 |     await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
      |                                                                                                                        ^ Error: Employee ID field should display Required error message
  199 |   });
  200 | 
  201 |    /**
  202 |    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_028
  203 |    * Verify if invalid Employee ID is reported as error while saving form  
  204 |    */
  205 |   test("TC_PIM_USER_ADD_028 - Add New User Form Validation - Verify invalid (format) Employee ID is rejected", async ({adminUserAuthPage}) => {
  206 |     test.slow();
  207 |     test.fail(true, 'Known bug in the app. Developers are to be notified');
  208 | 
  209 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');    
  210 | 
  211 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  212 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible').toBeVisible();    
  213 |     await navigationPage.navigateToPim();    
  214 | 
  215 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  216 |     await pimEmployeeListPage.navigateToAddEmployee();    
  217 |     
  218 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  219 |     const employeeIDInputLocator: Locator = addEmployeePage.getEmployeeIDInput();    
  220 |     await employeeIDInputLocator.fill('.@$./^&');//invalid junk
  221 |     await addEmployeePage.clickSave();
  222 |     
  223 |     await expect(addEmployeePage.getEmployeeIdFieldError(), "Employee ID field should display Required error message").toBeVisible();    
  224 |   });
  225 | });
  226 | 
  227 | 
```