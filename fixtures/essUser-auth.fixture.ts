import {test as base, expect, BrowserContext, Page} from "../tests/base";
import LoginPage from "../pages/LoginPage";

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

        await page.close();
    }
});


export * from "../tests/base";
export  {test};