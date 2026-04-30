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
  test('Admin can add a new employee with a profile photo without size error', async ({ adminUserAuthPage }) => {  
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
  test('Admin cannot add a new employee profile photo which has invalid format', async ({ adminUserAuthPage }) => {  
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
  test('Admin cannot add a new employee profile photo if it is too large', async ({ adminUserAuthPage }) => {  
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