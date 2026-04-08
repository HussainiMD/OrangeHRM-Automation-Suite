import {test, expect, Response, Locator, Page} from "../../../base";
import { AxeResults, Result } from 'axe-core';
import LoginPage from "../../../../pages/LoginPage";
import AxeBuilder from '@axe-core/playwright';
import { randomUUID } from "node:crypto";

async function analyzeAccessibility(page: Page, selector: string) {
    return await new AxeBuilder({ page })
        .include(selector)
        .withTags(['wcag2aa'])
        .analyze();
}

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_018
 * Verifies if the sensitive information like password is hidden. Not shown as plain text on web page
 * Indirect way of testing. HTML element with type password are automatically masked by browsers
 */
test('Is Password Field getting masked', async ({page}) => {
    const navResponse: Response | null = await page.goto('/web/index.php/auth/login');    
    expect(navResponse?.ok()).toBe(true);
    const loginLayoutLocator: Locator = page.locator('.orangehrm-login-layout');
    await expect(loginLayoutLocator).toBeVisible();

    const passwordLocator: Locator = page.locator('input[name="password"]');    

    await expect(passwordLocator).toHaveAttribute('type', 'password');
});

/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_028
 * Verify the right logo is being shown on the login page
 */
test('Ensure OrangeHRM Logo is being Displayed', async ({page, logger}) => {
    const navResponse: Response |  null = await page.goto('/web/index.php/auth/login');
    expect(navResponse?.ok()).toBe(true);
    const loginLayoutLocator: Locator = page.locator('.orangehrm-login-layout');
    await expect(loginLayoutLocator).toBeVisible();

    const brandImgLocator: Locator = loginLayoutLocator.locator('.orangehrm-login-branding > img').first();
    await expect(brandImgLocator).toBeVisible();//this is needed as we want to measure dimensions after image is loaded
    const brandImageDimensions: any = await brandImgLocator.boundingBox();
    logger.warn(`logo details: width-${brandImageDimensions?.width}, height-${brandImageDimensions?.height}`)
    expect(brandImageDimensions?.width).toBeGreaterThan(0);
    expect(brandImageDimensions?.height).toBeGreaterThan(0);
    
    /**
     * Playwright automatically stores snapshots next to the test file in a __snapshots__ or -snapshots folder based on your config. Hardcoding the full path is redundant and brittle 
     * Playwright automatically stores a version of same image for platform + browser for the first failure of test. For example on my laptop on chrome, it automatically created "ohrm-branding-staging-chrome-win32.png"
     * Over time, it creates multiple versions of same image screenshots
     * Playwright AUTOMATICALLY picks the version. I do NOT have to EXPLICITLY put that name here. Only saying "ohrm_branding.png" works, no need to say chrome + win32
    */
    await expect(brandImgLocator).toHaveScreenshot('ohrm_branding.png', {
         animations: "disabled",
         caret: "hide",        
         maxDiffPixelRatio: 0.02 
    });
})


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_030
 * Verifies the login with non existent user credentials. Asserts the error message shown on page to user
 */
test('Login error message should meet WCAG 2.1 AA accessibility standards', async ({page, logger}) => {
    const alertContentCSS: string = '.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text';
    const navResponse: Response|null = await page.goto('/web/index.php/auth/login');
    expect(navResponse?.ok()).toBe(true);

    const username: string = `invalid_user_${randomUUID()}`.slice(0, 40);//ensuring user length restrictions
    const password: string = 'does_not_exist';

    const loginPage:LoginPage = new LoginPage(page);
    await loginPage.signInWithCredentials({username, password});
    const alertMsgContentLocator:Locator = page.locator(alertContentCSS);
    await expect(alertMsgContentLocator).toHaveText(/.+/); //we cannot use toBeVisible() as visibility != render completion of styles
    
    const results = await analyzeAccessibility(page, alertContentCSS);
    const importantViolations: Result[] = results.violations.filter(v => 
        ['critical', 'serious'].includes(v.impact || '')
    );

    if(importantViolations.length > 0) {
        const importantVoilationsSpecifics = importantViolations.map(voilation => {
            return {
                id: voilation.id,
                impact: voilation.impact,
                description: voilation.description,
                nodes: voilation.nodes.map(node => {
                    return {
                        html: node.html,
                        failureSummary: node.failureSummary
                    }
                })
            }
        });
         
        logger.warn({ violations: importantVoilationsSpecifics }, 'Accessibility violations found');
    }
    else logger.info(`No Accessibility violations found`);

    expect(importantViolations.length).toBe(0);   
    await expect(alertMsgContentLocator).toHaveAttribute('role', /alert|status/); // for screen readers announcement
})