# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/auth/login-ui.spec.ts >> Ensure OrangeHRM Logo is being Displayed
- Location: tests/ui/regression/auth/login-ui.spec.ts:35:1

# Error details

```
Error: A snapshot doesn't exist at /home/runner/work/OrangeHRM-Automation-Suite/OrangeHRM-Automation-Suite/tests/ui/regression/auth/login-ui.spec.ts-snapshots/ohrm-branding-staging-firefox-linux.png, writing actual.
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]:
    - img "company-branding" [ref=e8]
    - generic [ref=e9]:
      - heading "Login" [level=5] [ref=e10]
      - generic [ref=e11]:
        - generic [ref=e13]:
          - paragraph [ref=e14]: "Username : Admin"
          - paragraph [ref=e15]: "Password : admin123"
        - generic [ref=e16]:
          - generic [ref=e18]:
            - generic [ref=e19]:
              - generic [ref=e20]: 
              - generic [ref=e21]: Username
            - textbox "Username" [active] [ref=e23]
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]: 
              - generic [ref=e28]: Password
            - textbox "Password" [ref=e30]
          - button "Login" [ref=e32] [cursor=pointer]
          - paragraph [ref=e34] [cursor=pointer]: Forgot your password?
      - generic [ref=e35]:
        - generic [ref=e36]:
          - link [ref=e37] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/orangehrm/mycompany/
          - link [ref=e40] [cursor=pointer]:
            - /url: https://www.facebook.com/OrangeHRM/
          - link [ref=e43] [cursor=pointer]:
            - /url: https://twitter.com/orangehrm?lang=en
          - link [ref=e46] [cursor=pointer]:
            - /url: https://www.youtube.com/c/OrangeHRMInc
        - generic [ref=e49]:
          - paragraph [ref=e50]: OrangeHRM OS 5.8
          - paragraph [ref=e51]:
            - text: © 2005 - 2026
            - link "OrangeHRM, Inc" [ref=e52] [cursor=pointer]:
              - /url: http://www.orangehrm.com
            - text: . All rights reserved.
  - img "orangehrm-logo" [ref=e54]
```

# Test source

```ts
  1   | import {test, expect, Response, Locator, Page} from "../../../base";
  2   | import { Result } from 'axe-core';
  3   | import LoginPage from "../../../../pages/LoginPage";
  4   | import AxeBuilder from '@axe-core/playwright';
  5   | import { randomUUID } from "node:crypto";
  6   | 
  7   | async function analyzeAccessibility(page: Page, selector: string) {
  8   |     return await new AxeBuilder({ page })
  9   |         .include(selector)
  10  |         .withTags(['wcag2aa'])
  11  |         .analyze();
  12  | }
  13  | 
  14  | /**
  15  |  * ID from Test Cases (spreadsheet): TC_LOGIN_018
  16  |  * Verifies if the sensitive information like password is hidden. Not shown as plain text on web page
  17  |  * Indirect way of testing. HTML element with type password are automatically masked by browsers
  18  |  */
  19  | test('Is Password Field getting masked', async ({page}) => {
  20  |     const navResponse: Response | null = await page.goto('/web/index.php/auth/login');    
  21  |     expect(navResponse?.ok(),'Navigation to the login page has failed').toBe(true);
  22  |     
  23  |     const loginLayoutLocator: Locator = page.locator('.orangehrm-login-layout');
  24  |     await expect(loginLayoutLocator, 'login button is not visible').toBeVisible();
  25  | 
  26  |     const passwordLocator: Locator = page.locator('input[name="password"]');    
  27  | 
  28  |     await expect(passwordLocator, 'password field is not configured to mask entered value').toHaveAttribute('type', 'password');
  29  | });
  30  | 
  31  | /**
  32  |  * ID from Test Cases (spreadsheet): TC_LOGIN_028
  33  |  * Verify the right logo is being shown on the login page
  34  |  */
  35  | test('Ensure OrangeHRM Logo is being Displayed', async ({page, logger}) => {
  36  |     const navResponse: Response |  null = await page.goto('/web/index.php/auth/login');
  37  |     expect(navResponse?.ok(),'Navigation to the login page has failed').toBe(true);
  38  |     const loginLayoutLocator: Locator = page.locator('.orangehrm-login-layout');
  39  |     await expect(loginLayoutLocator, 'login button is not visible').toBeVisible();
  40  | 
  41  |     const brandImgLocator: Locator = loginLayoutLocator.locator('.orangehrm-login-branding > img').first();
  42  |     await expect(brandImgLocator, 'login branding image is not visible').toBeVisible();//this is needed as we want to measure dimensions after image is loaded
  43  |     const brandImageDimensions: any = await brandImgLocator.boundingBox();
  44  |     logger.warn(`logo details: width-${brandImageDimensions?.width}, height-${brandImageDimensions?.height}`)
  45  |     expect(brandImageDimensions?.width, 'brand image dimensions width is zero').toBeGreaterThan(0);
  46  |     expect(brandImageDimensions?.height, 'brand image dimensions height is zero').toBeGreaterThan(0);
  47  |     
  48  |     /**
  49  |      * Playwright automatically stores snapshots next to the test file in a __snapshots__ or -snapshots folder based on your config. Hardcoding the full path is redundant and brittle 
  50  |      * Playwright automatically stores a version of same image for platform + browser for the first failure of test. For example on my laptop on chrome, it automatically created "ohrm-branding-staging-chrome-win32.png"
  51  |      * Over time, it creates multiple versions of same image screenshots
  52  |      * Playwright AUTOMATICALLY picks the version. I do NOT have to EXPLICITLY put that name here. Only saying "ohrm_branding.png" works, no need to say chrome + win32
  53  |     */
> 54  |     await expect(brandImgLocator, 'brand image screenshot is not matching').toHaveScreenshot('ohrm_branding.png', {
      |     ^ Error: A snapshot doesn't exist at /home/runner/work/OrangeHRM-Automation-Suite/OrangeHRM-Automation-Suite/tests/ui/regression/auth/login-ui.spec.ts-snapshots/ohrm-branding-staging-firefox-linux.png, writing actual.
  55  |          animations: "disabled",
  56  |          caret: "hide",        
  57  |          maxDiffPixelRatio: 0.02 
  58  |     });
  59  | })
  60  | 
  61  | 
  62  | /**
  63  |  * ID from Test Cases (spreadsheet): TC_LOGIN_030
  64  |  * Verifies the login with non existent user credentials. Asserts the error message shown on page to user
  65  |  */
  66  | test('Login error message should meet WCAG 2.1 AA accessibility standards', async ({page, logger}) => {
  67  |     const alertContainerCSS: string = '.orangehrm-login-form > .orangehrm-login-error';
  68  |     const alertContentCSS: string = `${alertContainerCSS} p.oxd-alert-content-text`;
  69  |     const loginPage:LoginPage = new LoginPage(page);
  70  |     await loginPage.navigateToLoginPage();
  71  | 
  72  |     const username: string = `invalid_user_${randomUUID()}`.slice(0, 40);//ensuring user length restrictions
  73  |     const password: string = 'does_not_exist';
  74  |     
  75  |     await loginPage.signInWithCredentials({username, password});
  76  |     const alertMsgContentLocator:Locator = page.locator(alertContentCSS);
  77  |     await expect(alertMsgContentLocator, 'user alert message have no content').toHaveText(/.+/); //we cannot use toBeVisible() as visibility != render completion of styles
  78  |     
  79  |     const results = await analyzeAccessibility(page, alertContentCSS);
  80  |     const importantViolations: Result[] = results.violations.filter(v => 
  81  |         ['critical', 'serious'].includes(v.impact || '')
  82  |     );
  83  | 
  84  |     if(importantViolations.length > 0) {
  85  |         const importantVoilationsSpecifics = importantViolations.map(voilation => {
  86  |             return {
  87  |                 id: voilation.id,
  88  |                 impact: voilation.impact,
  89  |                 description: voilation.description,
  90  |                 nodes: voilation.nodes.map(node => {
  91  |                     return {
  92  |                         html: node.html,
  93  |                         failureSummary: node.failureSummary
  94  |                     }
  95  |                 })
  96  |             }
  97  |         });
  98  |          
  99  |         logger.warn({ violations: importantVoilationsSpecifics }, 'Accessibility violations found');
  100 |     }
  101 |     else logger.info(`No Accessibility violations found`);
  102 | 
  103 |     expect(importantViolations.length, 'There are critical and serious voilations').toBe(0);   
  104 |     const alertMsgErrorLocator: Locator = page.locator(`${alertContainerCSS} .oxd-alert--error`);
  105 |     await expect(alertMsgErrorLocator, 'User message is not friendly due to accessibility issues').toHaveAttribute('role', /alert|status/); // for screen readers announcement
  106 | })
```