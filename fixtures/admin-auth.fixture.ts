import {test as base, BrowserContext, Page} from "../tests/base";
import { getValidAuthJSONPath } from "../utils/auth-manager.utils";

interface AdminUserFixture {
    adminUserAuthContext: BrowserContext,
    adminUserAuthPage: Page
}

/**
 * This fixture is specific for providing authenticated page with User as "Admin"
 * Logic around this is designed with an understanding that everytime context is created (which is used by auth page), it checks for validity
 * But if session expires during the MID of test execution, we will let it fail.
 * Upon next retry, it will get a fresh context with valid login. So, at least one retry should be enabled at global level for ALL tests. 
 * */
const test = base.extend<AdminUserFixture>({
    adminUserAuthContext: async ({browser}, use) => {
        
         /* Here browser context is created only for valid/active auth*/
        const adminUserContext: BrowserContext = await browser.newContext({
            storageState: await getValidAuthJSONPath()            
        });   
               
        await use(adminUserContext);

        await adminUserContext.close();
    },
    adminUserAuthPage: async ({adminUserAuthContext}, use) => { //here auth context is automatically being provided to this call back function
        const authenticatedPage = await adminUserAuthContext.newPage();             

        await use(authenticatedPage);
        
        await authenticatedPage.close();
    }
});

export * from "../tests/base";
export {test};