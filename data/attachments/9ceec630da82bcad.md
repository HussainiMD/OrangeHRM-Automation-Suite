# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/pim/add-employee-create-user.spec.ts >> PIM - Add Employee test case that should run in series to avoid duplicate employee ID issue >> TC_PIM_USER_ADD_022_02 | PIM | Add Employee | Successfully create employee with login credentials
- Location: tests/ui/regression/pim/add-employee-create-user.spec.ts:785:2

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: URL should change to the employee profile page after a successful save, confirming the record was created

expect(page).toHaveURL(expected) failed

Expected pattern: /\/pim\/viewPersonalDetails\/empNumber\/\d+/
Received string:  "https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee"

Call log:
  - URL should change to the employee profile page after a successful save, confirming the record was created with timeout 60000ms
    54 × unexpected value "https://opensource-demo.orangehrmlive.com/web/index.php/pim/addEmployee"

```

# Test source

```ts
  766 |     await addEmployeePage.fillConfirmPassword('Test@Pass1_MISMATCH'); 
  767 |     // ── Browser Back button ───────────────────────────────────────────────────
  768 |     await adminUserAuthPage.goBack();
  769 |  
  770 |     // ── Post-navigation assertions ──────────────────────────────────────────── 
  771 |     // URL must resolve to the Employee List page — not stay on addEmployee
  772 |     await expect(adminUserAuthPage, 'Browser Back should navigate away from the Add Employee form to the Employee List page' ).toHaveURL(/\/pim\/viewEmployeeList/);
  773 |   });  
  774 |   
  775 |  
  776 | })
  777 | 
  778 | 
  779 | 
  780 | test.describe.serial('PIM - Add Employee test case that should run in series to avoid duplicate employee ID issue', () => {
  781 |  /**
  782 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_022_02
  783 |     * verifies error when passowrd and confirm password field values are not matching. It is in create user form.
  784 |  */
  785 |  test(
  786 |   'TC_PIM_USER_ADD_022_02 | PIM | Add Employee | Successfully create employee with login credentials',
  787 |   {
  788 |     tag: [
  789 |       '@smoke',
  790 |       '@regression',
  791 |       '@pim',
  792 |       '@employee',
  793 |       '@user-management',
  794 |       '@create-user',
  795 |       '@positive-test',
  796 |       '@login-creation',
  797 |       '@admin',
  798 |     ],
  799 |     annotation: [
  800 |       // Quality / business area
  801 |       { type: 'epic', description: 'Functional' },
  802 | 
  803 |       // Functional hierarchy
  804 |       { type: 'feature', description: 'PIM' },
  805 |       { type: 'story', description: 'Add Employee' },
  806 | 
  807 |       // Suite grouping
  808 |       { type: 'suite', description: 'Create Employee Success Flow' },
  809 | 
  810 |       // Severity
  811 |       { type: 'severity', description: 'critical' },
  812 | 
  813 |       // Traceability
  814 |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_022_02' },
  815 | 
  816 |       // Human-readable intent
  817 |       {
  818 |         type: 'description',
  819 |         description:
  820 |           'Verifies that a new employee can be successfully created along with login credentials, and that the system redirects to the employee profile page after saving without validation errors.',
  821 |       },
  822 |     ],
  823 |   }, async ({ adminUserAuthPage }) => {
  824 |  
  825 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index'); 
  826 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  827 |     await expect(navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar').toBeVisible();
  828 |  
  829 |     await navigationPage.navigateToPim(); 
  830 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  831 |     await expect(pimEmployeeListPage.getEmployeeListButton(), 'Employee List button should be visible in the top navigation').toBeVisible();
  832 |     await expect(pimEmployeeListPage.getAddEmployeeButton(),'Add Employee button should be visible in the top navigation').toBeVisible();
  833 |     await pimEmployeeListPage.navigateToAddEmployee();
  834 |  
  835 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
  836 |     await expect(addEmployeePage.getSaveButton(),'Save button should be visible confirming the Add Employee form is loaded').toBeVisible();
  837 |  
  838 |     // Fill mandatory name fields
  839 |     await addEmployeePage.fillFirstName('John');
  840 |     await addEmployeePage.fillLastName('TestAuto');
  841 |     await addEmployeePage.clickCreateLoginDetails(); 
  842 |     // Username must be unique per run to avoid TC_PIM_USER_ADD_018 duplicate error
  843 |     const uniqueUsername = `test_user_${Date.now()}`;//Date.now() returns a long unique number
  844 |     await addEmployeePage.fillUserName(uniqueUsername); 
  845 |     // Password: meets OrangeHRM strong password requirement (upper + lower + symbol + number)
  846 |     const testPassword = 'Test@Pass1';
  847 |     await addEmployeePage.fillPassword(testPassword);
  848 |     await addEmployeePage.fillConfirmPassword(testPassword);
  849 |  
  850 |     // Verify status radio defaults to Enabled before submitting
  851 |     const loginStatusEnabled = addEmployeePage.getLoginStatusInputBy('Enabled');
  852 |     await expect(loginStatusEnabled, 'Login Status should default to Enabled before form submission').toBeChecked();
  853 |  
  854 |     await addEmployeePage.clickSave();
  855 |  
  856 |     // ── Post-save assertions ────────────────────────────────────────────────── 
  857 |     await expect( addEmployeePage.getFirstNameFieldError(), 'First Name field should NOT display a validation error after successful save' ).not.toBeVisible(); 
  858 |     await expect( addEmployeePage.getLastNameFieldError(), 'Last Name field should NOT display a validation error after successful save'
  859 |     ).not.toBeVisible(); 
  860 |     await expect( addEmployeePage.getUsernameFieldError(), 'Username field should NOT display a validation error after successful save').not.toBeVisible(); 
  861 |     await expect(addEmployeePage.getPasswordFieldError(), 'Password field should NOT display a validation error after successful save' ).not.toBeVisible(); 
  862 |     await expect(addEmployeePage.getConfirmPasswordFieldError(), 'Confirm Password field should NOT display a validation error after successful save').not.toBeVisible();
  863 |  
  864 |     // Successful save redirects to the employee profile page
  865 |     await expect(adminUserAuthPage,'URL should change to the employee profile page after a successful save, confirming the record was created'
> 866 |     ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
      |       ^ Error: URL should change to the employee profile page after a successful save, confirming the record was created
  867 |   });
  868 | 
  869 |   /**
  870 |     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_048
  871 |     * Verify Save and Cancel buttons are disabled while form submission is in progress. Form is for add employee
  872 |  */
  873 |   test(
  874 |   'TC_PIM_USER_ADD_048 | PIM | Add Employee | Shows loader during submission and completes save',
  875 |   {
  876 |     tag: [
  877 |       '@smoke',
  878 |       '@regression',
  879 |       '@pim',
  880 |       '@employee',
  881 |       '@user-management',
  882 |       '@create-user',
  883 |       '@form-submission',
  884 |       '@loading-state',
  885 |       '@positive-test',
  886 |       '@admin',
  887 |     ],
  888 |     annotation: [
  889 |       // Quality / business area
  890 |       { type: 'epic', description: 'Functional' },
  891 | 
  892 |       // Functional hierarchy
  893 |       { type: 'feature', description: 'PIM' },
  894 |       { type: 'story', description: 'Add Employee' },
  895 | 
  896 |       // Suite grouping
  897 |       { type: 'suite', description: 'Create Employee Submission State Handling' },
  898 | 
  899 |       // Severity
  900 |       { type: 'severity', description: 'normal' },
  901 | 
  902 |       // Traceability
  903 |       { type: 'testCaseId', description: 'TC_PIM_USER_ADD_048' },
  904 | 
  905 |       // Human-readable intent
  906 |       {
  907 |         type: 'description',
  908 |         description:
  909 |           'Verifies that during Add Employee form submission, the system displays a loading state (spinner/loader) and successfully completes the employee creation process by redirecting to the employee profile page.',
  910 |       },
  911 |     ],
  912 |   }, async ({ adminUserAuthPage }) => {
  913 |     await adminUserAuthPage.goto('/web/index.php/dashboard/index');
  914 |     const navigationPage = new NavigationPage(adminUserAuthPage);
  915 |     await expect( navigationPage.getPimNavItem(), 'PIM navigation item should be visible in the left sidebar' ).toBeVisible();
  916 |     await navigationPage.navigateToPim();
  917 |     const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
  918 |     await expect( pimEmployeeListPage.getAddEmployeeButton(), 'Add Employee button should be visible in the top navigation'
  919 |     ).toBeVisible(); 
  920 |     await pimEmployeeListPage.navigateToAddEmployee();
  921 |     const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
  922 |     await expect( addEmployeePage.getSaveButton(), 'Save button should be visible confirming the Add Employee form is loaded' ).toBeVisible();
  923 |  
  924 |     await addEmployeePage.fillFirstName('John');
  925 |     await addEmployeePage.fillLastName('TestAuto');
  926 |  
  927 |     await addEmployeePage.clickCreateLoginDetails();
  928 |  
  929 |     const uniqueUsername = `test_user_${Date.now()}`;
  930 |     await addEmployeePage.fillUserName(uniqueUsername);
  931 |  
  932 |     const testPassword = 'Test@Pass1';
  933 |     await addEmployeePage.fillPassword(testPassword);
  934 |     await addEmployeePage.fillConfirmPassword(testPassword);
  935 |      
  936 |     await addEmployeePage.clickSave();
  937 |     // loader or spinner forms overlay the action button avoiding user to do further actions
  938 |     await expect(addEmployeePage.getFormLoader(), 'Loader / Spinner is not shown to the user after clicking save').toBeVisible();    
  939 |  
  940 |     await expect( adminUserAuthPage, 'App should redirect to employee profile page after submission completes — ' +
  941 |       'confirms the intercepted request was released and processed correctly' ).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  942 |   });
  943 | })
```