import {test as base, APIRequestContext, APIResponse, BrowserContext, Page, Response, request} from "@playwright/test";
import { refreshAdminAuthState } from "../utils/auth-manager.utils";

interface AdminUserFixture {
    authContext: BrowserContext,
    authPage: Page
}

export const test = base.extend<AdminUserFixture>({
    authContext: async ({browser}, use) => {
        let adminUserContext: BrowserContext = await browser.newContext({
            storageState: './storage/admin-auth.json'            
        });               
        
        const adminPage: Page = await adminUserContext.newPage();        
        const navResponse: Response | null = await adminPage.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers', {waitUntil: "load"});        

        if(navResponse && navResponse.url().endsWith('login')) {
            console.log('Doing Re-Auth as current authentication (context) expired');
            try {
                await refreshAdminAuthState();
                adminUserContext = await browser.newContext({
                    storageState: './storage/admin-auth.json'
                })
            } catch(err) {
                console.log(err);
                throw err;
            }

        } else console.log('No need of Auth as current authentication is valid');

        
        await adminPage.close();

        await use(adminUserContext);
        adminUserContext.close();
    },
    authPage: async ({authContext}, use) => {
        const authenticatedPage = await authContext.newPage();             

        await use(authenticatedPage);
        authenticatedPage.close();
    }
})