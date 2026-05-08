# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/performance/response-time.spec.ts >> lighthouse performance metrics for login page
- Location: tests/ui/regression/performance/response-time.spec.ts:134:1

# Error details

```
Error: Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for Login Page

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
  48  |     const { categories, audits } = result?.lhr;
  49  | 
  50  |     const summary = {
  51  |       scores: {
  52  |         performance: categories.performance.score ? categories.performance.score * 100 : 0,
  53  |         accessibility: categories.accessibility.score ? categories.accessibility.score * 100 : 0,
  54  |         bestPractices: categories['best-practices'].score ? categories['best-practices'].score * 100 : 0,
  55  |         seo: categories.seo.score ? categories.seo.score * 100 : 0,
  56  |       },
  57  |       metrics: {
  58  |         lcp: audits['largest-contentful-paint'].numericValue ?? 0,
  59  |         cls: audits['cumulative-layout-shift'].numericValue ?? 0,
  60  |         tbt: audits['total-blocking-time'].numericValue ?? 0,
  61  |         fcp: audits['first-contentful-paint'].numericValue ?? 0,
  62  |       }
  63  |     };
  64  | 
  65  |     
  66  |     const report:LighthouseMetricsPerformanceReport = evaluateLighthousePerformanceMetrics({
  67  |       performanceScore: summary.scores.performance,
  68  |       lcp: summary.metrics.lcp,
  69  |       cls: summary.metrics.cls,
  70  |       tbt: summary.metrics.tbt,
  71  |       fcp: summary.metrics.fcp,
  72  |     });
  73  | 
  74  |   return report;
  75  | }
  76  | 
  77  | 
  78  | /**
  79  |  * ID from Test Cases (spreadsheet): TC_LOGIN_051
  80  |  * Collection of various approaches to measure load time, response time, user percieved times.
  81  |  */
  82  | 
  83  | test.describe.configure({ retries: 0 }); //makes no sense to do retry as these numbers are not expected to change.
  84  | /*those artificats are point less here, so turning off */
  85  | test.use({
  86  |     screenshot: 'off',
  87  |     trace: 'off',
  88  |     video: 'off'
  89  | });
  90  | 
  91  | /**Simpliest approach to measure response time. Base is treating loading time as backend response time */
  92  | test('Login and Dashboard Page Response Time', async ({page, logger}) => {        
  93  |     const loginPageStartTime = performance.now();
  94  |     const loginPage: LoginPage = new LoginPage(page);
  95  |     await loginPage.navigateToLoginPage();    
  96  |     await page.waitForLoadState('load');
  97  |     const loginPageEndTime = performance.now();
  98  |     // logger.warn(`logged in page duration - ${getFormattedTimeInSec(loginPageEndTime - loginPageStartTime)} seconds`);
  99  |     expect(loginPageEndTime - loginPageStartTime, 'Simplest approach: login page load times').toBeLessThanOrEqual(thresholds.fullLoad);
  100 |     
  101 |     await loginPage.signInWithCredentials({username, password});
  102 |     await page.waitForLoadState('load');
  103 | 
  104 |     const dashboardPageDuration: number = performance.now() - loginPageEndTime;
  105 |     logger.info(`dashboard page duration - ${getFormattedTimeInSec(dashboardPageDuration)} seconds`);
  106 |     expect(dashboardPageDuration, 'Simplest approach: dashboard page load times').toBeLessThan(thresholds.fullLoad);
  107 | });
  108 | 
  109 | 
  110 | /**More detailed approach to measure response times by listening to browser events of performance 
  111 |  * Here LCP - Largest Contentful paint time is measured only for Chromium browsers
  112 |  * as load & DomContentLoad times means only for resource loading, we are measuring LCP as a better option to see user interaction time (percieved)
  113 | */
  114 | test('Login Page load metrics measurement by using browser events', async ({ page, browserName, logger }, testInfo) => {  
  115 |   const pageMetrics: PageLoadPerfMetricsType = await measurePagePerformance(
  116 |     page,
  117 |     browserName,
  118 |     testInfo,
  119 |     '/web/index.php/auth/login'    
  120 |   );
  121 | 
  122 |   logger.info(pageMetrics, `metrics got after listening to browser events for performance`);
  123 | 
  124 |   // --- Assertions ---
  125 |   if (thresholds.lcp && pageMetrics.lcp) 
  126 |     expect(pageMetrics.lcp, 'Detailed approach: Largest Contentful Pain (LCP) is too slow').toBeLessThan(thresholds.lcp);
  127 |   
  128 |   expect(pageMetrics.fullLoad, 'Detailed approach: Full resource loading is very slow').toBeLessThan(thresholds.fullLoad);
  129 |   expect(pageMetrics.domContentLoaded, 'Detailed approach: Only DOM loading is very slow').toBeLessThan(thresholds.domContentLoaded);
  130 |   
  131 | })
  132 | 
  133 | /*Running lighthouse tool on chromium browser by running in debugging mode*/
  134 | test('lighthouse performance metrics for login page', async ({logger}) => {  
  135 |   /*BUG: LCP is consistently a larger number which needs to be fixed by engineering team*/
  136 |   test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  137 |   const chromeDebuggingPort: number = 9222;
  138 |   const browser: Browser = await launchChromiumInDebug(chromeDebuggingPort);
  139 |   const page: Page = await browser.newPage();
  140 |   const loginPage:LoginPage = new LoginPage(page);
  141 |   await loginPage.navigateToLoginPage();  
  142 | 
  143 |   const report: LighthouseMetricsPerformanceReport | null = await measureLighthousePerfMetrics(page, chromeDebuggingPort)
  144 | 
  145 |   if(report)   logger.info(report, `Login Page : lighthouse performance metrics results report`);
  146 |   else logger.warn(`Login Page : Did not get the lighthouse performance metrics report`);
  147 |   
> 148 |   expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for Login Page').not.toBe('BAD');
      |                                                                                                                                        ^ Error: Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for Login Page
  149 | });
  150 | 
  151 | 
  152 | test('lighthouse performance metrics for dashboard page', async ({logger}) => {  
  153 |   /*BUG: LCP is consistently a larger number which needs to be fixed by engineering team*/
  154 |   test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  155 |   const chromeDebuggingPort: number = 9333;
  156 |   const browser: Browser = await launchChromiumInDebug(chromeDebuggingPort);
  157 | 
  158 |   const page: Page = await browser.newPage();
  159 |   const loginPage:LoginPage = new LoginPage(page);
  160 |   await loginPage.navigateToLoginPage();  
  161 |   await loginPage.signInWithCredentials({username, password});
  162 | 
  163 |   const report: LighthouseMetricsPerformanceReport | null = await measureLighthousePerfMetrics(page, chromeDebuggingPort)
  164 | 
  165 |   if(report) logger.info(report, `Dashboard Page : lighthouse performance metrics results report`);
  166 |   else logger.warn(`Dashboard Page : Did not get the lighthouse performance metrics report`);
  167 | 
  168 |   expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page').not.toBe('BAD');
  169 | });
  170 | 
  171 | 
  172 | 
```