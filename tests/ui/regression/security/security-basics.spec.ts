import {test, expect, Response} from "../../../base";

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