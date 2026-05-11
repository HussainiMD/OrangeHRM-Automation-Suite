import { test, expect } from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { PimEmployeeListPage } from '../../../../pages/PimEmployeeListPage';
import { AddEmployeePage } from '../../../../pages/AddEmployeePage';
import path from 'path';

test.describe('PIM - Add Employee: profile photo validation', () => {
  /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_008
    * verifies if add employee form accepts less than 1 MB profile photo
 */
  test(
  'TC_PIM_USER_ADD_008 | PIM | Add Employee | Profile photo upload under 1MB succeeds',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@file-upload',
      '@profile-photo',
      '@positive-test',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Profile Photo Upload' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_008' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Add Employee form accepts a profile photo file smaller than 1MB without triggering upload validation errors.',
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
    
    // add valid profile photo.   
    const profilePhotoPath = path.join('data', 'employee', 'uploads', 'valid_size_profile_photo.jpg');// < 1MB file
    await addEmployeePage.attachProfilePhoto(profilePhotoPath);
    await addEmployeePage.clickSave();    

    await expect(addEmployeePage.getProfilePhotoLoadError(), "Error message for profile photo upload").not.toBeVisible();
  });

  /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_011
    * verifies if add employee form rejects invalid format (BMP, TIFF, WEBP) profile photo
 */
  test(
  'TC_PIM_USER_ADD_011 | PIM | Add Employee | Reject invalid profile photo formats',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@file-upload',
      '@profile-photo',
      '@negative-test',
      '@validation',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Profile Photo Upload Validation' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_011' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Add Employee form rejects profile photo uploads with unsupported file formats (such as WEBP, BMP, and TIFF) and displays an appropriate validation error message.',
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
    
    // add profile photo.   
    const profilePhotoPath = path.join('data', 'employee', 'uploads', 'invalid_format_profile_photo.webp');// webp is invalid format
    await addEmployeePage.attachProfilePhoto(profilePhotoPath);
    await addEmployeePage.clickSave();    

    await expect(addEmployeePage.getProfilePhotoLoadError(), "Error message for profile photo upload").toHaveText(/file\s*type\s*not\s*allowed/i);
  });

  /**
    * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_012
    * verifies if add employee form rejects large size profile photo (more than 1 MB)
 */
  test(
  'TC_PIM_USER_ADD_012 | PIM | Add Employee | Reject profile photo larger than 1MB',
  {
    tag: [
      '@smoke',
      '@regression',
      '@pim',
      '@employee',
      '@user-management',
      '@create-user',
      '@file-upload',
      '@profile-photo',
      '@negative-test',
      '@validation',
      '@size-limit',
      '@admin',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Functional' },

      // Functional hierarchy
      { type: 'feature', description: 'PIM' },
      { type: 'story', description: 'Add Employee' },

      // Suite grouping
      { type: 'suite', description: 'Create Employee Profile Photo Upload Validation' },

      // Severity
      { type: 'severity', description: 'normal' },

      // Traceability
      { type: 'testCaseId', description: 'TC_PIM_USER_ADD_012' },

      // Human-readable intent
      {
        type: 'description',
        description:
          'Verifies that the Add Employee form rejects profile photo uploads when the file size exceeds 1MB and displays an appropriate size validation error message.',
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
    
    // add profile photo.   
    const profilePhotoPath = path.join('data', 'employee', 'uploads', 'invalid_size_profile_photo.jpg');// > 1MB file
    await addEmployeePage.attachProfilePhoto(profilePhotoPath);
    await addEmployeePage.clickSave();    

    await expect(addEmployeePage.getProfilePhotoLoadError(), "Error message for profile photo upload").toHaveText(/(?=.*size)(?=.*exceeded)/i); //match anywhere..look ahead pattern ?=
  });

});