# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/pim/add-employee-create-user.spec.ts >> PIM - Add Employee: with new user form validation >> Verify username rejects duplicate user if provided in user form fields
- Location: tests/ui/regression/pim/add-employee-create-user.spec.ts:103:3

# Error details

```
Error: User Name field should display duplicate user error message

expect(locator).toBeVisible() failed

Locator: locator('.oxd-form > .orangehrm-employee-container').locator('.oxd-input-group').filter({ hasText: /Username/i }).locator('span.oxd-input-field-error-message')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - User Name field should display duplicate user error message with timeout 60000ms
  - waiting for locator('.oxd-form > .orangehrm-employee-container').locator('.oxd-input-group').filter({ hasText: /Username/i }).locator('span.oxd-input-field-error-message')

```

# Test source

```ts
  27  |     
  28  |     await addEmployeePage.clickCreateLoginDetails();
  29  | 
  30  |     const userNameLabel: Locator = addEmployeePage.getLabelInCreateLoginForm('Username');
  31  |     await expect(userNameLabel).toBeVisible();
  32  | 
  33  |     const passwordLabel: Locator = addEmployeePage.getLabelInCreateLoginForm('Password');
  34  |     await expect(passwordLabel).not.toHaveCount(0);
  35  |   });
  36  | 
  37  |    /**
  38  |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_016
  39  |     * verifies create user form has username and password fields are mandatory
  40  |  */
  41  |   test('Verify user form fields are username and password are required', async ({ adminUserAuthPage }) => {  
  42  |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  43  |     
  44  |     const navigationPage = new NavigationPage(adminUserAuthPage);
  45  |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  46  |     
  47  |     await navigationPage.navigateToPim();
  48  |     
  49  |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  50  |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  51  |     
  52  |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  53  |     
  54  |     await pimEmployeeListPage.navigateToAddEmployee();
  55  |     
  56  |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  57  |     
  58  |     await addEmployeePage.clickCreateLoginDetails();
  59  |     await addEmployeePage.clickSaveWithoutFillingForm();
  60  | 
  61  |     const usernameFieldError = addEmployeePage.getUsernameFieldError();
  62  |     const passwordFieldErrpr = addEmployeePage.getPasswordFieldError();
  63  |     // Verify that field displays validation error
  64  |     await expect(usernameFieldError, 'User Name field should display Required error message').toBeVisible();  
  65  |     await expect(passwordFieldErrpr, 'Password field should display Required error message').not.toHaveCount(0);  //covers both password and confirm password
  66  |   });
  67  |   
  68  |    /**
  69  |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_017
  70  |     * verifies create user form accepts valid username 
  71  |  */
  72  |   test('Verify username accepts valid value in user form fields', async ({ adminUserAuthPage }) => {  
  73  |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  74  |     
  75  |     const navigationPage = new NavigationPage(adminUserAuthPage);
  76  |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  77  |     
  78  |     await navigationPage.navigateToPim();
  79  |     
  80  |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  81  |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  82  |     
  83  |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  84  |     
  85  |     await pimEmployeeListPage.navigateToAddEmployee();
  86  |     
  87  |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  88  |     
  89  |     await addEmployeePage.clickCreateLoginDetails();
  90  | 
  91  |     await addEmployeePage.fillUserName('User_JohnTest');
  92  |     await addEmployeePage.clickSave();
  93  | 
  94  |     const usernameFieldError = addEmployeePage.getUsernameFieldError();    
  95  |     // Verify that field does NOT display validation error
  96  |     await expect(usernameFieldError, 'User Name field should NOT display Required error message').not.toBeVisible();          
  97  |   });
  98  | 
  99  |    /**
  100 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_018
  101 |     * verifies create user form reject duplicate username 
  102 |  */
  103 |   test('Verify username rejects duplicate user if provided in user form fields', async ({ adminUserAuthPage }) => {  
  104 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  105 |     
  106 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  107 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  108 |     
  109 |     await navigationPage.navigateToPim();
  110 |     
  111 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  112 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  113 |     
  114 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  115 |     
  116 |     await pimEmployeeListPage.navigateToAddEmployee();
  117 |     
  118 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  119 |     
  120 |     await addEmployeePage.clickCreateLoginDetails();
  121 | 
  122 |     await addEmployeePage.fillUserName(process.env.ess_user_name ?? 'Admin');
  123 |     await addEmployeePage.clickSave();
  124 | 
  125 |     const usernameFieldError = addEmployeePage.getUsernameFieldError();    
  126 |     // Verify that field displays validation error
> 127 |     await expect(usernameFieldError, 'User Name field should display duplicate user error message').toBeVisible();      
      |                                                                                                     ^ Error: User Name field should display duplicate user error message
  128 |   });
  129 | 
  130 |    /**
  131 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_019
  132 |     * verifies create user form login status is enabled
  133 |  */
  134 |   test('Verify new user login form is enabled by default', async ({ adminUserAuthPage }) => {  
  135 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  136 |     
  137 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  138 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  139 |     
  140 |     await navigationPage.navigateToPim();
  141 |     
  142 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  143 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  144 |     
  145 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  146 |     
  147 |     await pimEmployeeListPage.navigateToAddEmployee();
  148 |     
  149 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  150 |     
  151 |     await addEmployeePage.clickCreateLoginDetails();
  152 |     
  153 |     const loginFormStatusInput = addEmployeePage.getLoginStatusInputBy('Enabled');
  154 |    
  155 |     await expect(loginFormStatusInput, 'In User form, status is NOT enabled by default').toBeChecked();      
  156 |   });
  157 |   
  158 |    /**
  159 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_020
  160 |     * Verify if the form allow user login status to disabled
  161 |  */
  162 |   test('Verify new user login form is enabled by default but allows user to disable it', async ({ adminUserAuthPage}) => {  
  163 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  164 |     
  165 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  166 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  167 |     
  168 |     await navigationPage.navigateToPim();
  169 |     
  170 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  171 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  172 |     
  173 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  174 |     
  175 |     await pimEmployeeListPage.navigateToAddEmployee();
  176 |     
  177 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  178 |     
  179 |     await addEmployeePage.clickCreateLoginDetails();
  180 |     
  181 |     const loginFormStatusInputEnabled = addEmployeePage.getLoginStatusInputBy('Enabled');
  182 |    
  183 |     await expect(loginFormStatusInputEnabled, 'In User form, status is NOT enabled by default').toBeChecked();    
  184 |     const loginFormStatusInputDisabled = addEmployeePage.getLoginStatusInputBy('Disabled');  
  185 |     
  186 |     await loginFormStatusInputDisabled.focus();
  187 |     await adminUserAuthPage.keyboard.press('Space');
  188 | 
  189 |     await expect(loginFormStatusInputEnabled, 'In User form, status should NOT be enabled after clicking on disabled').not.toBeChecked();    
  190 |   });
  191 |   
  192 |    /**
  193 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_021
  194 |     * verifies passowrd and confirm password field values are matching. It is in create user form.
  195 |  */
  196 |   test('Verify user form fields password and confirm passowrd are matching', async ({ adminUserAuthPage }) => {  
  197 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  198 |     
  199 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  200 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  201 |     
  202 |     await navigationPage.navigateToPim();
  203 |     
  204 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  205 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  206 |     
  207 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  208 |     
  209 |     await pimEmployeeListPage.navigateToAddEmployee();
  210 |     
  211 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  212 |     
  213 |     await addEmployeePage.clickCreateLoginDetails();
  214 |     const testPassword = 'password@123';
  215 |     await addEmployeePage.fillPassword(testPassword);
  216 |     await addEmployeePage.fillConfirmPassword(testPassword);
  217 |     await addEmployeePage.clickSave();
  218 |     
  219 |     const confirmPasswordFieldErrpr = addEmployeePage.getConfirmPasswordFieldError();
  220 |     // Verify that field does NOT displays validation error
  221 |     await expect(confirmPasswordFieldErrpr, 'User Name field should display Required error message').not.toBeVisible();        
  222 |   });
  223 |   
  224 |    /**
  225 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_022
  226 |     * verifies error when passowrd and confirm password field values are not matching. It is in create user form.
  227 |  */
```