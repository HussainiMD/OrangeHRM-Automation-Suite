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
    expect(navResponse?.ok(),'Navigation to the default home page has failed').toBe(true);    
    await expect(page, 'URL is not secure; missing HTTPS').toHaveURL(/^https/, {ignoreCase: true});//starts with https    

    /*Verifying SSL details */
    const securityDetails = await navResponse?.securityDetails();
    if (!securityDetails) throw new Error('No security details returned — possibly non-HTTPS or non-Chromium browser');
    expect(securityDetails?.issuer, 'SSL certificate issues is not available').toBeDefined();
    expect(securityDetails?.protocol, 'Secure protocol information is not available').toContain('TLS');
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

    expect(foundUsername, 'request URL should not have user name (credentials) in clear text').toBe(false);
    expect(foundPassword, 'request URL should not have password (credentials) in clear text').toBe(false);
})


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_039
 * Verifies if user credentials are being logged in clear text in browser console
 */
test('Network Request - Password Encryption', async ({page, logger}) => {
    let foundUsername: boolean = false;
    let foundPassword: boolean = false;

    page.on('console', (msg) => {
        logger.warn(`message type - ${msg.type()} | text - ${msg.text()}`);
        if(!foundUsername) foundUsername = msg.text().includes(username);
        if(!foundPassword) foundPassword = msg.text().includes(password);        
    })

    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();

    await loginPage.signInWithCredentials({username, password});  
    /*This is necessary as we want to capture all the redirects and resource load request in above monitoring using page.on()*/
    await page.waitForLoadState("networkidle");

    expect(foundUsername,'request URL should not have user name (credentials) in clear text').toBe(false);
    expect(foundPassword, 'request URL should not have password (credentials) in clear text').toBe(false);
})