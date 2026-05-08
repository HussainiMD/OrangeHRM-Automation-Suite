# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/auth/sessionManagement.spec.ts >> Browser Back Button After Login
- Location: tests/ui/regression/auth/sessionManagement.spec.ts:9:1

# Error details

```
Error: Page URL is not what is expected

expect(page).toHaveURL(expected) failed

Expected pattern: /dashboard/i
Received string:  "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
Timeout: 60000ms

Call log:
  - Page URL is not what is expected with timeout 60000ms
    63 × unexpected value "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"

```

# Test source

```ts
  1  | import {test, expect} from "../../../../fixtures/essUser-auth.fixture";
  2  | 
  3  | const dashboardURLRegEx: RegExp = /dashboard/i; 
  4  | 
  5  | /**
  6  |  * ID from Test Cases (spreadsheet): TC_LOGIN_025
  7  |  * Verifies the scenario where user clicks on browser back button after successful login to the AUT
  8  | */
  9  | test('Browser Back Button After Login', async ({essUserAuthPage, browserName}) => {    
  10 |     const webkitRegex = /webkit/i;
  11 |     /*BUG: up on back button, app is going to login page despite active session. Ideally it should go to dashboard page*/
  12 |     test.fail(!webkitRegex.test(browserName), 'Known bug in the app specific to firefox and chrome browsers. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  13 |     await essUserAuthPage.goBack();   
> 14 |     await expect(essUserAuthPage, 'Page URL is not what is expected').toHaveURL(dashboardURLRegEx);
     |                                                                       ^ Error: Page URL is not what is expected
  15 | });
  16 | 
  17 | 
  18 | /**
  19 |  * ID from Test Cases (spreadsheet): TC_LOGIN_026
  20 |  * Verifies the scenario where user hits refresh button on browser after successful login to the AUT
  21 | */
  22 | test('Refresh Page After Login', async ({essUserAuthPage}) => {    
  23 |     await essUserAuthPage.reload();    
  24 |     await expect(essUserAuthPage, 'Page URL is not what is expected').toHaveURL(dashboardURLRegEx);
  25 | });
```