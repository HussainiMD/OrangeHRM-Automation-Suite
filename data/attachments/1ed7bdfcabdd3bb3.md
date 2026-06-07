# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/auth/userActivityInExpiredSession.spec.ts >> TC_LOGIN_013 | Authentication | Session Management | Session expiry forces re-login on user action
- Location: tests/ui/regression/auth/userActivityInExpiredSession.spec.ts:9:1

# Error details

```
Error: MyInfo button is not enabled

expect(locator).toBeEnabled() failed

Locator: locator('.oxd-sidepanel a.oxd-main-menu-item').filter({ hasText: 'My Info' })
Expected: enabled
Timeout: 60000ms
Error: element(s) not found

Call log:
  - MyInfo button is not enabled with timeout 60000ms
  - waiting for locator('.oxd-sidepanel a.oxd-main-menu-item').filter({ hasText: 'My Info' })

```

# Test source

```ts
  1  | import {test, expect, Locator} from "../../../../fixtures/essUser-auth.fixture";
  2  | 
  3  | /**
  4  |  * ID from Test Cases (spreadsheet): TC_LOGIN_013
  5  |  * Verifies the AUT behavior if the session expires.
  6  |  * This scenario is emulated by deleting the cookies after successful login
  7  |  * Here is the complete flow: Login as ESS user -> clear cookies (AUT domain) -> Click on My Info to trigger a login verification
  8  |  */
  9  | test(
  10 |   'TC_LOGIN_013 | Authentication | Session Management | Session expiry forces re-login on user action',
  11 |   {
  12 |     tag: [
  13 |       '@smoke',
  14 |       '@regression',
  15 |       '@authentication',
  16 |       '@session-management',
  17 |       '@security',
  18 |       '@cookie',
  19 |       '@login',
  20 |     ],
  21 |     annotation: [
  22 |       // Functional hierarchy
  23 |       { type: 'feature', description: 'Authentication' },
  24 |       { type: 'story', description: 'Session Management' },
  25 | 
  26 |       // Optional grouping in Allure
  27 |       { type: 'suite', description: 'Session Expiry Handling' },
  28 | 
  29 |       // Cross-functional classification
  30 |       { type: 'relatedFeature', description: 'Security' },
  31 | 
  32 |       // Business criticality
  33 |       { type: 'severity', description: 'critical' },
  34 | 
  35 |       // External traceability
  36 |       { type: 'testCaseId', description: 'TC_LOGIN_013' },
  37 | 
  38 |       // Human-readable description
  39 |       {
  40 |         type: 'description',
  41 |         description:
  42 |           'Verifies that when an authenticated session expires, the application redirects the user to the login page when the user attempts to access a protected module.',
  43 |       },
  44 |     ],
  45 |   }, async ({essUserAuthPage, essUserAuthContext, browserName}) => {
  46 |    
  47 |    const domain: string = new URL(essUserAuthPage.url()).hostname;   
  48 |    
  49 |    /**Similating session expiry by clearing cookies */ 
  50 |    await essUserAuthContext.clearCookies({domain});
  51 |    
  52 |    if((/webkit/i).test(browserName)) await essUserAuthPage.waitForLoadState('networkidle');//webkit sometimes causes UI freezes
  53 |    /*Clicking on UI element after session is expired, it automatically redirects user to login page*/
  54 |    const myInfoBtnLocator: Locator = essUserAuthPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({hasText: 'My Info'});
> 55 |    await expect(myInfoBtnLocator, 'MyInfo button is not enabled').toBeEnabled();   
     |                                                                   ^ Error: MyInfo button is not enabled
  56 |    await myInfoBtnLocator.click();
  57 |    /*session expiry should redirect to login */
  58 |    await expect(essUserAuthPage, 'Page URL is not referring to login page').toHaveURL(/\/auth\/login/i); //does regex match with wait and auto retries after click()
  59 | })
  60 | 
  61 | 
```