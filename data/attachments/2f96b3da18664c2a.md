# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui/regression/performance/response-time.spec.ts >> lighthouse performance metrics for dashboard page
- Location: tests/ui/regression/performance/response-time.spec.ts:152:1

# Error details

```
Error: Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page

expect(received).not.toBe(expected) // Object.is equality

Expected: not "BAD"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic:
    - complementary [ref=e4]:
      - navigation "Sidepanel" [ref=e5]:
        - generic [ref=e6]:
          - link "client brand banner" [ref=e7] [cursor=pointer]:
            - /url: https://www.orangehrm.com/
            - img "client brand banner" [ref=e9]
          - text: 
        - generic [ref=e10]:
          - generic [ref=e11]:
            - generic [ref=e12]:
              - textbox "Search" [ref=e15]
              - button "" [ref=e16] [cursor=pointer]:
                - generic [ref=e17]: 
            - separator [ref=e18]
          - list [ref=e19]:
            - listitem [ref=e20]:
              - link "Leave" [ref=e21] [cursor=pointer]:
                - /url: /web/index.php/leave/viewLeaveModule
                - generic [ref=e24]: Leave
            - listitem [ref=e25]:
              - link "Time" [ref=e26] [cursor=pointer]:
                - /url: /web/index.php/time/viewTimeModule
                - generic [ref=e32]: Time
            - listitem [ref=e33]:
              - link "My Info" [ref=e34] [cursor=pointer]:
                - /url: /web/index.php/pim/viewMyDetails
                - generic [ref=e40]: My Info
            - listitem [ref=e41]:
              - link "Performance" [ref=e42] [cursor=pointer]:
                - /url: /web/index.php/performance/viewPerformanceModule
                - generic [ref=e50]: Performance
            - listitem [ref=e51]:
              - link "Dashboard" [ref=e52] [cursor=pointer]:
                - /url: /web/index.php/dashboard/index
                - generic [ref=e55]: Dashboard
            - listitem [ref=e56]:
              - link "Directory" [ref=e57] [cursor=pointer]:
                - /url: /web/index.php/directory/viewDirectory
                - generic [ref=e60]: Directory
            - listitem [ref=e61]:
              - link "Claim" [ref=e62] [cursor=pointer]:
                - /url: /web/index.php/claim/viewClaimModule
                - img [ref=e65]
                - generic [ref=e69]: Claim
            - listitem [ref=e70]:
              - link "Buzz" [ref=e71] [cursor=pointer]:
                - /url: /web/index.php/buzz/viewBuzz
                - generic [ref=e74]: Buzz
    - banner [ref=e75]:
      - generic [ref=e76]:
        - generic [ref=e77]:
          - text: 
          - heading "Dashboard" [level=6] [ref=e79]
        - list [ref=e81]:
          - listitem [ref=e82]:
            - generic [ref=e83] [cursor=pointer]:
              - img "profile picture" [ref=e84]
              - paragraph [ref=e85]: playwright employee_007
              - generic [ref=e86]: 
      - navigation "Topbar Menu" [ref=e88]:
        - list [ref=e89]:
          - button "" [ref=e91] [cursor=pointer]:
            - generic [ref=e92]: 
  - generic [ref=e93]:
    - generic [ref=e95]:
      - generic [ref=e97]:
        - generic [ref=e99]:
          - generic [ref=e100]: 
          - paragraph [ref=e101]: Time at Work
        - separator [ref=e102]
        - generic [ref=e104]:
          - generic [ref=e105]:
            - img "profile picture" [ref=e107]
            - generic [ref=e108]:
              - paragraph [ref=e109]: Not Punched In
              - paragraph
          - generic [ref=e110]:
            - generic [ref=e111]: 0h 0m Today
            - button "" [ref=e112] [cursor=pointer]:
              - generic [ref=e113]: 
          - separator [ref=e114]
          - generic [ref=e115]:
            - generic [ref=e116]:
              - paragraph [ref=e117]: This Week
              - paragraph [ref=e118]: May 04 - May 10
            - generic [ref=e119]:
              - generic [ref=e120]: 
              - paragraph [ref=e121]: 0h 0m
      - generic [ref=e125]:
        - generic [ref=e127]:
          - generic [ref=e128]: 
          - paragraph [ref=e129]: My Actions
        - separator [ref=e130]
        - generic [ref=e132]:
          - img "No Content" [ref=e133]
          - paragraph [ref=e134]: No Pending Actions to Perform
      - generic [ref=e136]:
        - generic [ref=e138]:
          - generic [ref=e139]: 
          - paragraph [ref=e140]: Quick Launch
        - separator [ref=e141]
        - generic [ref=e143]:
          - generic [ref=e144]:
            - button "Apply Leave" [ref=e145] [cursor=pointer]
            - generic "Apply Leave" [ref=e148]:
              - paragraph [ref=e149]: Apply Leave
          - generic [ref=e150]:
            - button "My Leave" [ref=e151] [cursor=pointer]
            - generic "My Leave" [ref=e156]:
              - paragraph [ref=e157]: My Leave
          - generic [ref=e158]:
            - button "My Timesheet" [ref=e159] [cursor=pointer]
            - generic "My Timesheet" [ref=e162]:
              - paragraph [ref=e163]: My Timesheet
      - generic [ref=e165]:
        - generic [ref=e167]:
          - generic [ref=e168]: 
          - paragraph [ref=e169]: Buzz Latest Posts
        - separator [ref=e170]
        - generic [ref=e172]:
          - generic [ref=e173]:
            - generic [ref=e174] [cursor=pointer]:
              - img "profile picture" [ref=e176]
              - generic [ref=e177]:
                - paragraph [ref=e178]: manda akhil user
                - paragraph [ref=e179]: 2026-08-05 04:14 PM
            - separator [ref=e180]
            - paragraph [ref=e181]: Safety Check
          - generic [ref=e182]:
            - generic [ref=e183] [cursor=pointer]:
              - img "profile picture" [ref=e185]
              - generic [ref=e186]:
                - paragraph [ref=e187]: manda akhil user
                - paragraph [ref=e188]: 2026-08-05 04:13 PM
            - separator [ref=e189]
            - paragraph [ref=e190]: Updated Text
          - generic [ref=e191]:
            - generic [ref=e192] [cursor=pointer]:
              - img "profile picture" [ref=e194]
              - generic [ref=e195]:
                - paragraph [ref=e196]: manda akhil user
                - paragraph [ref=e197]: 2026-08-05 04:12 PM
            - separator [ref=e198]
            - paragraph [ref=e199]: Engagement
          - generic [ref=e200]:
            - generic [ref=e201] [cursor=pointer]:
              - img "profile picture" [ref=e203]
              - generic [ref=e204]:
                - paragraph [ref=e205]: manda akhil user
                - paragraph [ref=e206]: 2020-08-10 03:38 AM
            - separator [ref=e207]
            - paragraph [ref=e208]: "Hi All; Linda has been blessed with a baby boy! Linda: With love, we welcome your dear new baby to this world. Congratulations!"
          - generic [ref=e209]:
            - generic [ref=e210] [cursor=pointer]:
              - img "profile picture" [ref=e212]
              - generic [ref=e213]:
                - paragraph [ref=e214]: Sania Shaheen
                - paragraph [ref=e215]: 2020-08-10 03:38 AM
            - separator [ref=e216]
            - paragraph [ref=e217]: "World Championship: What makes the perfect snooker player? Mark Selby: Robertson has one of the best techniques in the game. It is very, very straight and he fully commits to every single shot he plays. John Higgins: Every shot is repetitive. He always keeps the same technique and cues through the ball bang straight. Barry Hawkins: Robertson is textbook with his grip and has a ramrod solid cue action, delivering it in a straight line. Honourable mentions: Shaun Murphy, Ding Junhui, Jack Lisowski."
      - generic [ref=e219]:
        - paragraph [ref=e225]: Employees on Leave Today
        - separator [ref=e226]
        - generic [ref=e228]:
          - img "No Content" [ref=e229]
          - paragraph [ref=e230]: No Employees are on Leave Today
    - generic [ref=e231]:
      - paragraph [ref=e232]: OrangeHRM OS 5.8
      - paragraph [ref=e233]:
        - text: © 2005 - 2026
        - link "OrangeHRM, Inc" [ref=e234] [cursor=pointer]:
          - /url: http://www.orangehrm.com
        - text: . All rights reserved.
```

# Test source

```ts
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
  148 |   expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for Login Page').not.toBe('BAD');
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
> 168 |   expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page').not.toBe('BAD');
      |                                                                                                                                            ^ Error: Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page
  169 | });
  170 | 
  171 | 
  172 | 
```