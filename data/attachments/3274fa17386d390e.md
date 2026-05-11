# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/security/security-basics.spec.ts >> Security: Brute Force Protection >> TC_LOGIN_072 | Security | Brute Force | Login endpoint enforces anti-automation protections
- Location: tests/ui/regression/security/security-basics.spec.ts:178:3

# Error details

```
Error: No brute-force protection detected after repeated failed attempts

expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]:
    - img "company-branding" [ref=e8]
    - generic [ref=e9]:
      - heading "Login" [level=5] [ref=e10]
      - generic [ref=e11]:
        - generic [ref=e12]:
          - alert [ref=e13]:
            - generic [ref=e14]:
              - generic [ref=e15]: 
              - paragraph [ref=e16]: Invalid credentials
          - generic [ref=e18]:
            - paragraph [ref=e19]: "Username : Admin"
            - paragraph [ref=e20]: "Password : admin123"
        - generic [ref=e21]:
          - generic [ref=e23]:
            - generic [ref=e24]:
              - generic [ref=e25]: 
              - generic [ref=e26]: Username
            - textbox "Username" [active] [ref=e28]
          - generic [ref=e30]:
            - generic [ref=e31]:
              - generic [ref=e32]: 
              - generic [ref=e33]: Password
            - textbox "Password" [ref=e35]
          - button "Login" [ref=e37] [cursor=pointer]
          - paragraph [ref=e39] [cursor=pointer]: Forgot your password?
      - generic [ref=e40]:
        - generic [ref=e41]:
          - link [ref=e42] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/orangehrm/mycompany/
          - link [ref=e45] [cursor=pointer]:
            - /url: https://www.facebook.com/OrangeHRM/
          - link [ref=e48] [cursor=pointer]:
            - /url: https://twitter.com/orangehrm?lang=en
          - link [ref=e51] [cursor=pointer]:
            - /url: https://www.youtube.com/c/OrangeHRMInc
        - generic [ref=e54]:
          - paragraph [ref=e55]: OrangeHRM OS 5.8
          - paragraph [ref=e56]:
            - text: © 2005 - 2026
            - link "OrangeHRM, Inc" [ref=e57] [cursor=pointer]:
              - /url: http://www.orangehrm.com
            - text: . All rights reserved.
  - img "orangehrm-logo" [ref=e59]
```

# Test source

```ts
  173 |  * Verifies the brute force attempts using invalid user credentials. Asserts the page has adequate protection
  174 |  */
  175 | test.describe('Security: Brute Force Protection', () => {
  176 |   test.describe.configure({ retries: 0 });
  177 | 
  178 |   test(
  179 |       'TC_LOGIN_072 | Security | Brute Force | Login endpoint enforces anti-automation protections',
  180 |       {
  181 |         tag: [
  182 |           '@security',
  183 |           '@bruteforce',
  184 |           '@rate-limiting',
  185 |           '@auth',
  186 |           '@critical',
  187 |         ],
  188 |         annotation: [
  189 |           { type: 'epic', description: 'Authentication Security' },
  190 |           { type: 'feature', description: 'Brute Force Protection' },
  191 |           { type: 'story', description: 'Prevent Automated Login Attacks' },
  192 | 
  193 |           { type: 'suite', description: 'Authentication Abuse Protection' },
  194 | 
  195 |           { type: 'severity', description: 'critical' },
  196 | 
  197 |           { type: 'testCaseId', description: 'TC_LOGIN_072' },
  198 | 
  199 |           {
  200 |             type: 'description',
  201 |             description:
  202 |               'Verifies that the login system implements brute-force protections such as rate limiting, account locking, CAPTCHA triggers, or progressive delay after repeated failed authentication attempts.',
  203 |           },
  204 |         ],
  205 |       }, async ({ page }) => {
  206 |     /*BUG: there is no basic protection for serious attacks like DDOS which needs to be fixed by engineering team*/
  207 |     test.fail(true, 'Known bug in the app. Developers are to be notified');
  208 | 
  209 |     // Override the test timeout to 3 minutes for WebKit as it consumes ~20s on initial JS bundle downloads alone    
  210 |     test.setTimeout(180_000);
  211 |     
  212 |     const MAX_ATTEMPTS: number = 20;
  213 | 
  214 |     const loginPage: LoginPage = new LoginPage(page);
  215 |     await loginPage.navigateToLoginPage();
  216 | 
  217 |     const username = 'invalid_user';
  218 |     const password = 'wrong_password';
  219 | 
  220 |     let lockDetected = false;
  221 |     let rateLimitDetected = false;
  222 |     let delays: number[] = [];
  223 |     
  224 |     const errorLocator = page.locator(
  225 |       '.orangehrm-login-form > .orangehrm-login-error p.oxd-alert-content-text'
  226 |     );
  227 | 
  228 |     for (let i = 1; i <= MAX_ATTEMPTS; i++) {
  229 |       const start = performance.now();
  230 | 
  231 |       /*Filter by POST method to exclude CORS OPTIONS preflight requests.
  232 |        Firefox and WebKit send preflight requests that also hit /auth/validate,
  233 |        causing waitForResponse to resolve early with the wrong response object.*/
  234 |       const [response] = await Promise.all([
  235 |         page.waitForResponse(
  236 |           resp =>
  237 |             resp.url().includes('/auth/validate') &&
  238 |             resp.request().method() === 'POST',
  239 |           { timeout: 15_000 } //Explicit timeout — not relyin on global default
  240 |         ),
  241 |         loginPage.signInWithCredentials({ username, password }),
  242 |       ]);
  243 | 
  244 |       const duration = performance.now() - start;
  245 |       delays.push(duration);
  246 | 
  247 |       /*IMP: Wait for the error element to be visible before reading it.
  248 |        Chrome renders fast enough to mask this race; Firefox and WebKit do not.
  249 |        Use a try/catch so a missing element (no error shown) doesn't throw.*/
  250 |       let errorText = '';
  251 |       try {
  252 |         await errorLocator.waitFor({ state: 'visible', timeout: 5_000 });
  253 |         errorText = (await errorLocator.textContent()) ?? '';
  254 |       } catch {
  255 |         // Error element not present on this attempt — that's valid, continue loop
  256 |       }
  257 | 
  258 |       if (/locked|too many|captcha|blocked/i.test(errorText)) {
  259 |         lockDetected = true;
  260 |         break;
  261 |       }
  262 | 
  263 |       if (response.status() === 429) {
  264 |         rateLimitDetected = true;
  265 |         break;
  266 |       }
  267 |     }
  268 | 
  269 |     // --- Assertions ---
  270 |     expect(
  271 |       lockDetected || rateLimitDetected,
  272 |       'No brute-force protection detected after repeated failed attempts'
> 273 |     ).toBeTruthy();
      |       ^ Error: No brute-force protection detected after repeated failed attempts
  274 | 
  275 |     const hasDelayIncrease = delays.some((d, i) => i > 0 && d > delays[i - 1] * 1.5);
  276 | 
  277 |     expect(hasDelayIncrease,
  278 |       'No progressive delay detected in login attempts'
  279 |     ).toBeTruthy();
  280 |   });
  281 | });
  282 | 
```