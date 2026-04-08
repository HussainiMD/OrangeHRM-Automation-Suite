import {test, expect, Response} from "../../../base";
import LoginPage from "../../../../pages/LoginPage";

const username: string = process.env.ess_user_name??'';
const password: string = process.env.ess_user_password??'';

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_036
 * Verifies if the URL has HTTPS protocol Specified and whether security details has SSL certificate and uses TLS protocol
 */
test('Security (HTTPS) Protocol Verification of base URL', async ({page}) => {
    const navResponse: Response | null = await page.goto('/');
    expect(navResponse?.ok()).toBe(true);    
    await expect(page).toHaveURL(/^https/, {ignoreCase: true});//starts with https    

    /*Verifying SSL details */
    const securityDetails = await navResponse?.securityDetails();
    if (!securityDetails) throw new Error('No security details returned — possibly non-HTTPS or non-Chromium browser');
    expect(securityDetails?.issuer).toBeDefined();
    expect(securityDetails?.protocol).toContain('TLS');
})


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_038
 * Verifies if the URL has user credentials being sent in clear text
 */
test('Verifying User Credentials NOT getting exposed as clear text', async ({page}) => {
    let foundUsername: boolean = false;
    let foundPassword: boolean = false;

    /*captures multiple requests which can be a result of hitting one endpoint*/
    page.on('request', (request) => {
        const requestURL: string = request.url();
        if(!foundUsername) //once true, flag is raised, no need further tests
            foundUsername = requestURL.includes(username);
        if(!foundPassword) //once true, flag is raised, no need further tests
            foundPassword = requestURL.includes(password);
    })

    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();

    await loginPage.signInWithCredentials({username, password});            

    /*This is necessary as we want to capture all the redirects and resource load request in above monitoring using page.on()*/
    await page.waitForLoadState("networkidle");

    expect(foundUsername).toBe(false);
    expect(foundPassword).toBe(false);
})