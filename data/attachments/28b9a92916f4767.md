# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/performance/response-time.spec.ts >> TC_LOGIN_051-004 | Performance | Dashboard | Lighthouse performance audit
- Location: tests/ui/regression/performance/response-time.spec.ts:268:1

# Error details

```
Error: Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page

expect(received).not.toBe(expected) // Object.is equality

Expected: not "BAD"
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
  219 |       // Functional hierarchy
  220 |       { type: 'feature', description: 'Authentication' },
  221 |       { type: 'story', description: 'Login' },
  222 | 
  223 |       // Optional grouping in Allure Suites tab
  224 |       { type: 'suite', description: 'Lighthouse Audits' },
  225 | 
  226 |       // Business criticality
  227 |       { type: 'severity', description: 'normal' },
  228 | 
  229 |       // External traceability
  230 |       { type: 'testCaseId', description: 'TC_LOGIN_051-003' },
  231 | 
  232 |       // Human-readable description
  233 |       {
  234 |         type: 'description',
  235 |         description:
  236 |           'Runs a Google Lighthouse performance audit against the login page and verifies that the overall performance score is acceptable.',
  237 |       },
  238 |     ],
  239 |   }, async ({logger}) => {  
  240 |   /*BUG: LCP is consistently a larger number which needs to be fixed by engineering team*/
  241 |   test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  242 |   const chromeDebuggingPort: number = 9222;
  243 |   const browser: Browser = await launchChromiumInDebug(chromeDebuggingPort);
  244 |   const page: Page = await browser.newPage();
  245 |   const loginPage:LoginPage = new LoginPage(page);
  246 |   await loginPage.navigateToLoginPage();  
  247 | 
  248 |   const report: LighthouseMetricsPerformanceReport | null = await measureLighthousePerfMetrics(page, chromeDebuggingPort)
  249 | 
  250 |   if(report)   logger.info(report, `Login Page : lighthouse performance metrics results report`);
  251 |   else logger.warn(`Login Page : Did not get the lighthouse performance metrics report`);
  252 |   
  253 |   expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for Login Page').not.toBe('BAD');
  254 | });
  255 | 
  256 | 
  257 | /**
  258 |  * Measures dashboard page performance using Google Lighthouse running
  259 |  * against a Chromium instance launched in remote debugging mode.
  260 |  *
  261 |  * Test flow:
  262 |  * 1. Launch Chromium with remote debugging enabled.
  263 |  * 2. Navigate to the login page.
  264 |  * 3. Authenticate as a valid user.
  265 |  * 4. Run Lighthouse against the dashboard page.
  266 |  * 5. Verify the overall performance rating is acceptable.
  267 |  */
  268 | test(
  269 |   'TC_LOGIN_051-004 | Performance | Dashboard | Lighthouse performance audit',
  270 |   {
  271 |     tag: [
  272 |       '@performance',
  273 |       '@dashboard',
  274 |       '@lighthouse',
  275 |       '@metrics',
  276 |       '@non-functional',
  277 |       '@chromium-only',
  278 |     ],
  279 |     annotation: [
  280 |       // Quality / business area
  281 |       { type: 'epic', description: 'Performance' },
  282 | 
  283 |       // Functional hierarchy
  284 |       { type: 'feature', description: 'Dashboard' },
  285 |       { type: 'story', description: 'Page Load Performance' },
  286 | 
  287 |       // Optional grouping in Allure Suites tab
  288 |       { type: 'suite', description: 'Lighthouse Audits' },
  289 | 
  290 |       // Business criticality
  291 |       { type: 'severity', description: 'normal' },
  292 | 
  293 |       // External traceability
  294 |       { type: 'testCaseId', description: 'TC_LOGIN_051-004' },
  295 | 
  296 |       // Human-readable description
  297 |       {
  298 |         type: 'description',
  299 |         description:
  300 |           'Runs a Google Lighthouse performance audit against the authenticated dashboard page and verifies that the overall performance score is acceptable.',
  301 |       },
  302 |     ],
  303 |   }, async ({logger}) => {  
  304 |   /*BUG: LCP is consistently a larger number which needs to be fixed by engineering team*/
  305 |   test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  306 |   const chromeDebuggingPort: number = 9333;
  307 |   const browser: Browser = await launchChromiumInDebug(chromeDebuggingPort);
  308 | 
  309 |   const page: Page = await browser.newPage();
  310 |   const loginPage:LoginPage = new LoginPage(page);
  311 |   await loginPage.navigateToLoginPage();  
  312 |   await loginPage.signInWithCredentials({username, password});
  313 | 
  314 |   const report: LighthouseMetricsPerformanceReport | null = await measureLighthousePerfMetrics(page, chromeDebuggingPort)
  315 | 
  316 |   if(report) logger.info(report, `Dashboard Page : lighthouse performance metrics results report`);
  317 |   else logger.warn(`Dashboard Page : Did not get the lighthouse performance metrics report`);
  318 | 
> 319 |   expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page').not.toBe('BAD');
      |                                                                                                                                            ^ Error: Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page
  320 | });
  321 | 
  322 | 
  323 | 
```