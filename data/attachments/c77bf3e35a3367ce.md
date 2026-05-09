# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/auth/userActivityInExpiredSession.spec.ts >> User Session Expired - Re-login enforced on User Action
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
  9  | test('User Session Expired - Re-login enforced on User Action', async ({essUserAuthPage, essUserAuthContext, browserName}) => {
  10 |    
  11 |    const domain: string = new URL(essUserAuthPage.url()).hostname;   
  12 |    
  13 |    /**Similating session expiry by clearing cookies */ 
  14 |    await essUserAuthContext.clearCookies({domain});
  15 |    
  16 |    if((/webkit/i).test(browserName)) await essUserAuthPage.waitForLoadState('networkidle');//webkit sometimes causes UI freezes
  17 |    /*Clicking on UI element after session is expired, it automatically redirects user to login page*/
  18 |    const myInfoBtnLocator: Locator = essUserAuthPage.locator('.oxd-sidepanel a.oxd-main-menu-item').filter({hasText: 'My Info'});
> 19 |    await expect(myInfoBtnLocator, 'MyInfo button is not enabled').toBeEnabled();   
     |                                                                   ^ Error: MyInfo button is not enabled
  20 |    await myInfoBtnLocator.click();
  21 |    /*session expiry should redirect to login */
  22 |    await expect(essUserAuthPage, 'Page URL is not referring to login page').toHaveURL(/\/auth\/login/i); //does regex match with wait and auto retries after click()
  23 | })
  24 | 
  25 | 
```