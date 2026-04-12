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


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_072
 * Verifies the brute force attempts using invalid user credentials. Asserts the page has adequate protection
 */
test.describe('Security: Brute Force Protection', () => {
  test.describe.configure({ retries: 0 });  

  test('Rate Limiting on Login Attempts - should enforce protection on repeated failed logins', async ({ page}) => {
    /*BUG: there is no basic protection for serious attacks like DDOS which needs to be fixed by engineering team*/
    test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
    const MAX_ATTEMPTS: number = 20;

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();

    const username = 'invalid_user';
    const password = 'wrong_password';

    let lockDetected = false;
    let rateLimitDetected = false;
    let delays: number[] = [];

    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      const start = performance.now();

      //wait for auth/validate api response along with hitting submit button. Hence clubbed in Promise.all()
      const [response] = await Promise.all([
        page.waitForResponse(
            resp => resp.url().includes('/auth/validate') 
        ), 
        loginPage.signInWithCredentials({username, password})
      ]);
     
      const duration = performance.now() - start;
      delays.push(duration);

      const errorText = await page.locator('.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text').textContent();
      
      // Detect lockout / captcha / throttling message
      if ((/locked|too many|captcha|blocked/i).test(errorText || '')) {
        lockDetected = true;
        break;
      }

      // Detect HTTP 429 (Too Many Requests) via response      
      if (response.status() === 429) {
        rateLimitDetected = true;
        break;
      }
    }

    // --- Assertions ---
    expect(lockDetected || rateLimitDetected,
      'No brute-force protection detected after repeated failed attempts'
    ).toBeTruthy();

    /* Optional: detect increasing delay (progressive throttling). We are finding if at least one delay is 1.5X times previous delay*/
    const hasDelayIncrease = delays.some((d, i) => i > 0 && d > delays[i - 1] * 1.5);

    expect(hasDelayIncrease,
      'No progressive delay detected in login attempts'
    ).toBeTruthy();
  });
});