import {Response, Browser, Page, chromium, Locator} from "../tests/base";
import baseLogger from "./logger";

const baseURL: string = process.env.base_url ?? 'https://opensource-demo.orangehrmlive.com';

/**Implictly process is supposed to have the environment variables already available
 * @returns a boolean value of the function result
*/
export function isCredentialsEnvValid() : boolean {
    const fields : Array<string> = [process.env.base_url??'', process.env.admin_user_name??'', process.env.admin_password??'', process.env.ess_user_name??'', process.env.ess_user_password??''];

    for(let idx=0; idx < fields.length; idx++) {
        if(!fields[idx] || typeof fields[idx] != 'string' || fields[idx].length == 0) return false;        
    }

    return true;
}

/**Verify that application under test is UP and Running
 * @returns boolean value. "true" means AUT is good for use
 */
export async function isAUTReadyForTesting(): Promise<boolean> {
    let browser: Browser | null = null;
    let page: Page | null = null;

    try {
        browser = await chromium.launch({headless: true});
        page = await browser.newPage({baseURL});
        const navResponse: Response | null = await page.goto('/web/index.php/auth/login');
        if(!navResponse) {
            baseLogger.warn('Failed to navigate to login page when AUT is being evaluated for test readyness');
            return false;
        }

        const elementContainer: Locator = page.locator('.orangehrm-login-container .orangehrm-login-slot');
        const heading: Locator = elementContainer.getByRole('heading').or(elementContainer.locator('.orangehrm-login-title'));
        const headingText: string = (await heading.textContent()) ?? '';
        //ensuring Localization (language) is set for english only to continue with test suite
        if(!(/Login/i).test(headingText)) {
            baseLogger.warn(`AUT is NOT set for english as language. Login Banner is "${headingText}"`);
            return false;
        }

        return true;        
    } catch(err) {
        baseLogger.warn(`Encountered following error while evaluating AUT for test readyness: ${err}`);
        return false;
    } finally {
        if(page) await page.close();
        if(browser) await browser.close();
    }

}
