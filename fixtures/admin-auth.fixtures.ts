import {test as base, APIRequestContext, APIResponse, BrowserContext, Page, Response, request} from "@playwright/test";
import { refreshAdminAuthState } from "../utils/auth-manager.utils";

interface AdminUserFixture {
    authContext: BrowserContext,
    authPage: Page
}

export const test = base.extend<AdminUserFixture>({
    authContext: async ({browser}, use) => {
        
        const apiRequestContext:APIRequestContext = await request.newContext({
            baseURL: process.env.base_URL,
            storageState: './storage/admin-auth.json'
        });

        /** This API call will fail if made from expired/non authenticated context. 
         * We are fetching only 1 record (limit=1) for FASTER execution 
         */
        const apiResponse:APIResponse = await apiRequestContext.get('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=1');

        const apiRespStatus:number = apiResponse.status();        
        console.log(`Got response code ${apiRespStatus} while accessing URL-${apiResponse.url()}`)
        ;
        if(apiRespStatus >= 400 && apiRespStatus < 500) {
            console.log('Doing Re-Auth as current authentication (context) expired');
            try {
                await refreshAdminAuthState();                
            } catch(err) {
                console.log(err);
                throw err;
            } finally {
                apiRequestContext.dispose(); // no need to do "await" as we trust it to happen. This helps increase script execution time
            }

        } else console.log('No need of Auth as current authentication is valid');

        /* Here browser context is created only for valid/active auth*/
        const adminUserContext: BrowserContext = await browser.newContext({
            storageState: './storage/admin-auth.json'            
        });               
               
        await use(adminUserContext);

        adminUserContext.close();
    },
    authPage: async ({authContext}, use) => {
        const authenticatedPage = await authContext.newPage();             

        await use(authenticatedPage);
        
        authenticatedPage.close();
    }
})