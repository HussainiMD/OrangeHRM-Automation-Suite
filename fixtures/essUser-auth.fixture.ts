import {test as base, expect, BrowserContext, Page, APIResponse} from "../tests/base";
import LoginPage from "../pages/LoginPage";
import baseLogger from "../utils/logger";

const username: string = process.env.ess_user_name??'';
const password: string = process.env.ess_user_password??'';

interface ESSUserType {
    essUserAuthContext: BrowserContext,
    essUserAuthPage: Page
}

/**When compared with Admin Auth fixture, here we have a different approach.
 * In Admin fixture, we are relying on the Auth manager (and storage state auth json) for context. It ensures only ONE session on server to be used
 * Instead of auth json approach, here we are NOT re-using the session. Here we provide with fresh logged in page (with new context and seperate session on server side)
 */
const test = base.extend<ESSUserType>({
    essUserAuthContext: async ({browser}, use) => {
       const context: BrowserContext = await browser.newContext();
       await use(context);
       await context.close();
    },
    essUserAuthPage: async ({essUserAuthContext}, use) => {
        const page: Page = await essUserAuthContext.newPage();        
        const loginPage: LoginPage = new LoginPage(page);
        await loginPage.navigateToLoginPage();

        await loginPage.signInWithCredentials({username, password});        
        await expect(page).toHaveURL(/dashboard/i); // auth gate

        await use(page);

        /*Becuase this fixture is designed to have concurrent sessions of same ESS user, we want to close session on server as well to make whole test suite stable */
        try {
            const logoutResponse: APIResponse = await page.request.get('/web/index.php/auth/logout');
            const logoutResponseStatus: number = logoutResponse.status();
            if(logoutResponseStatus !== 200 && logoutResponseStatus !== 302) 
                throw new Error(`Logout API response status code: ${logoutResponseStatus} and message: ${await logoutResponse.text()}`);
        } catch(err) {
            baseLogger.warn(err, `Unexpected response/error while calling Logout API. `);
        }   

        await page.close();
    }
});


export * from "../tests/base";
export  {test};