# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/pim/add-employee-create-user.spec.ts >> PIM - Add Employee: with new user form validation >> TC_PIM_USER_ADD_018 | PIM | Add Employee | Username field rejects duplicate usernames
- Location: tests/ui/regression/pim/add-employee-create-user.spec.ts:215:3

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
  177 |       // Human-readable description
  178 |       {
  179 |         type: 'description',
  180 |         description:
  181 |           'Verifies that the Username field in the Create Login Details section accepts a valid username and does not display validation errors.',
  182 |       },
  183 |     ],
  184 |   }, async ({ adminUserAuthPage }) => {  
  185 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  186 |     
  187 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  188 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  189 |     
  190 |     await navigationPage.navigateToPim();
  191 |     
  192 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  193 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  194 |     
  195 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  196 |     
  197 |     await pimEmployeeListPage.navigateToAddEmployee();
  198 |     
  199 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  200 |     
  201 |     await addEmployeePage.clickCreateLoginDetails();
  202 | 
  203 |     await addEmployeePage.fillUserName('User_JohnTest');
  204 |     await addEmployeePage.clickSave();
  205 | 
  206 |     const usernameFieldError = addEmployeePage.getUsernameFieldError();    
  207 |     // Verify that field does NOT display validation error
  208 |     await expect(usernameFieldError, 'User Name field should NOT display Required error message').not.toBeVisible();          
  209 |   });
  210 | 
  211 |    /**
  212 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_018
  213 |     * verifies create user form reject duplicate username 
  214 |  */
  215 |   test(
  216 |   'TC_PIM_USER_ADD_018 | PIM | Add Employee | Username field rejects duplicate usernames',
  217 |   {
  218 |     tag: [
  219 |       '@smoke',
  220 |       '@regression',
  221 |       '@pim',
  222 |       '@employee',
  223 |       '@user-management',
  224 |       '@create-user',
  225 |       '@validation',
  226 |       '@negative',
  227 |       '@admin',
  228 |     ],
  229 |     annotation: [
  230 |       // Quality / business area
  231 |       { type: 'epic', description: 'Functional' },
  232 | 
  233 |       // Functional hierarchy
  234 |       { type: 'feature', description: 'PIM' },
  235 |       { type: 'story', description: 'Add Employee' },
  236 | 
  237 |       // Optional grouping in Allure Suites tab
  238 |       { type: 'suite', description: 'Create Login Details Validation' },
  239 | 
  240 |       // Business criticality
  241 |       { type: 'severity', description: 'critical' },
  242 | 
  243 |       // External traceability
  244 |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_018' },
  245 | 
  246 |       // Human-readable description
  247 |       {
  248 |         type: 'description',
  249 |         description:
  250 |           'Verifies that the Username field in the Create Login Details section rejects a username that already exists and displays a duplicate username validation error.',
  251 |       },
  252 |     ],
  253 |   }, async ({ adminUserAuthPage }) => {  
  254 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  255 |     
  256 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  257 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  258 |     
  259 |     await navigationPage.navigateToPim();
  260 |     
  261 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  262 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  263 |     
  264 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  265 |     
  266 |     await pimEmployeeListPage.navigateToAddEmployee();
  267 |     
  268 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  269 |     
  270 |     await addEmployeePage.clickCreateLoginDetails();
  271 | 
  272 |     await addEmployeePage.fillUserName(process.env.ess_user_name ?? 'Admin');
  273 |     await addEmployeePage.clickSave();
  274 | 
  275 |     const usernameFieldError = addEmployeePage.getUsernameFieldError();    
  276 |     // Verify that field displays validation error
> 277 |     await expect(usernameFieldError, 'User Name field should display duplicate user error message').toBeVisible();      
      |                                                                                                     ^ Error: User Name field should display duplicate user error message
  278 |   });
  279 | 
  280 |    /**
  281 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_019
  282 |     * verifies create user form login status is enabled
  283 |  */
  284 |   test(
  285 |   'TC_PIM_USER_ADD_019 | PIM | Add Employee | Login status is enabled by default',
  286 |   {
  287 |     tag: [
  288 |       '@smoke',
  289 |       '@regression',
  290 |       '@pim',
  291 |       '@employee',
  292 |       '@user-management',
  293 |       '@create-user',
  294 |       '@default-values',
  295 |       '@admin',
  296 |     ],
  297 |     annotation: [
  298 |       // Quality / business area
  299 |       { type: 'epic', description: 'Functional' },
  300 | 
  301 |       // Functional hierarchy
  302 |       { type: 'feature', description: 'PIM' },
  303 |       { type: 'story', description: 'Add Employee' },
  304 | 
  305 |       // Optional grouping in Allure Suites tab
  306 |       { type: 'suite', description: 'Create Login Details Defaults' },
  307 | 
  308 |       // Business criticality
  309 |       { type: 'severity', description: 'normal' },
  310 | 
  311 |       // External traceability
  312 |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_019' },
  313 | 
  314 |       // Human-readable description
  315 |       {
  316 |         type: 'description',
  317 |         description:
  318 |           'Verifies that the Login Status option in the Create Login Details section is preselected as "Enabled" by default.',
  319 |       },
  320 |     ],
  321 |   }, async ({ adminUserAuthPage }) => {  
  322 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  323 |     
  324 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  325 |     await expect(navigationPage.getPimNavItem(), "PIM navigation item should be visible in left sidebar").toBeVisible();
  326 |     
  327 |     await navigationPage.navigateToPim();
  328 |     
  329 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  330 |     await expect(pimEmployeeListPage.getEmployeeListButton(), "Employee List button should be visible in top navigation").toBeVisible();
  331 |     
  332 |     await expect(pimEmployeeListPage.getAddEmployeeButton(), "Add Employee button should be visible in top navigation").toBeVisible();
  333 |     
  334 |     await pimEmployeeListPage.navigateToAddEmployee();
  335 |     
  336 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);    
  337 |     
  338 |     await addEmployeePage.clickCreateLoginDetails();
  339 |     
  340 |     const loginFormStatusInput = addEmployeePage.getLoginStatusInputBy('Enabled');
  341 |    
  342 |     await expect(loginFormStatusInput, 'In User form, status is NOT enabled by default').toBeChecked();      
  343 |   });
  344 |   
  345 |    /**
  346 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_020
  347 |     * Verify if the form allow user login status to disabled
  348 |  */
  349 |   test(
  350 |   'TC_PIM_USER_ADD_020 | PIM | Add Employee | Login status can be changed to Disabled',
  351 |   {
  352 |     tag: [
  353 |       '@smoke',
  354 |       '@regression',
  355 |       '@pim',
  356 |       '@employee',
  357 |       '@user-management',
  358 |       '@create-user',
  359 |       '@default-values',
  360 |       '@form-interaction',
  361 |       '@admin',
  362 |     ],
  363 |     annotation: [
  364 |       // Quality / business area
  365 |       { type: 'epic', description: 'Functional' },
  366 | 
  367 |       // Functional hierarchy
  368 |       { type: 'feature', description: 'PIM' },
  369 |       { type: 'story', description: 'Add Employee' },
  370 | 
  371 |       // Optional grouping in Allure Suites tab
  372 |       { type: 'suite', description: 'Create Login Details Defaults' },
  373 | 
  374 |       // Business criticality
  375 |       { type: 'severity', description: 'normal' },
  376 | 
  377 |       // External traceability
```