import {test, expect, chromium, Browser, Page} from "../../../base";
import { measurePagePerformance } from "../../../../utils/page-load-performance.utils";
import LoginPage from "../../../../pages/LoginPage";
import { PageLoadPerfMetricsType } from "../../../../utils/types/PageLoadPerfMetricsType";
import { PageLoadMetricsThresholdsType } from "../../../../utils/types/PageLoadMetricsThresholdsType";
import lighthouse, { RunnerResult } from "lighthouse";
import { evaluateLighthousePerformanceMetrics } from "../../../../utils/lighthouse-performance.evaluator";
import { LighthouseMetricsPerformanceReport } from "../../../../utils/types/lighthouse-performance.types";

const username: string = process.env.ess_user_name??'';
const password: string = process.env.ess_user_password??'';
const thresholds: PageLoadMetricsThresholdsType = {
      /*all values in milli seconds*/
      lcp: 30000,//looks counter intutive but load is all resource availabe but not be parsed and rendered by browser
      fullLoad: 25000,
      domContentLoaded: 24000
}

/*utility function to format number to a 2 digit after decimal point */
function getFormattedTimeInSec(num: number) {
    return (num/1000).toFixed(2)
}

async function launchChromiumInDebug(portNum: number): Promise<Browser> {
    const browser: Browser = await chromium.launch({
      args: [`--remote-debugging-port=${portNum}`] //needs dedicated port for lighthouse tool
    });

    return browser;
}


/**
 * Function to measure page performance. Here we will use chromium browser to use inbuilt lighthouse tool for measuring page performance.
 * LCP - largest contentful paint
 * CLS - cumulative layout shift
 * TBT - total blocking time
 * FCP - first contentful paint
 */
async function measureLighthousePerfMetrics(page: Page, port: number): Promise<LighthouseMetricsPerformanceReport | null> {
    const result: RunnerResult | undefined = await lighthouse(page.url(), {
      port,
      output: 'json'
    });

    if(!result?.lhr) return null;//lhr is the main object of interest

    const { categories, audits } = result?.lhr;

    const summary = {
      scores: {
        performance: categories.performance.score ? categories.performance.score * 100 : 0,
        accessibility: categories.accessibility.score ? categories.accessibility.score * 100 : 0,
        bestPractices: categories['best-practices'].score ? categories['best-practices'].score * 100 : 0,
        seo: categories.seo.score ? categories.seo.score * 100 : 0,
      },
      metrics: {
        lcp: audits['largest-contentful-paint'].numericValue ?? 0,
        cls: audits['cumulative-layout-shift'].numericValue ?? 0,
        tbt: audits['total-blocking-time'].numericValue ?? 0,
        fcp: audits['first-contentful-paint'].numericValue ?? 0,
      }
    };

    
    const report:LighthouseMetricsPerformanceReport = evaluateLighthousePerformanceMetrics({
      performanceScore: summary.scores.performance,
      lcp: summary.metrics.lcp,
      cls: summary.metrics.cls,
      tbt: summary.metrics.tbt,
      fcp: summary.metrics.fcp,
    });

  return report;
}


/**
 * ID from Test Cases (spreadsheet): TC_LOGIN_051
 * Collection of various approaches to measure load time, response time, user percieved times.
 */

test.describe.configure({ retries: 0 }); //makes no sense to do retry as these numbers are not expected to change.
/*those artificats are point less here, so turning off */
test.use({
    screenshot: 'off',
    trace: 'off',
    video: 'off'
});

/**Simpliest approach to measure response time. Base is treating loading time as backend response time */
test(
  'TC_LOGIN_051-001 | Performance | Login | Login and dashboard page response time',
  {
    tag: [
      '@performance',
      '@login',
      '@dashboard',
      '@metrics',
      '@response-time',
      '@non-functional',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Performance' },

      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Performance Metrics' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_051-001' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Measures the login page load time and the dashboard page load time after successful authentication and validates both against configured thresholds.',
      },
    ],
  }, async ({page, logger}) => {        
    const loginPageStartTime = performance.now();
    const loginPage: LoginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();    
    await page.waitForLoadState('load');
    const loginPageEndTime = performance.now();
    // logger.warn(`logged in page duration - ${getFormattedTimeInSec(loginPageEndTime - loginPageStartTime)} seconds`);
    expect(loginPageEndTime - loginPageStartTime, 'Simplest approach: login page load times').toBeLessThanOrEqual(thresholds.fullLoad);
    
    await loginPage.signInWithCredentials({username, password});
    await page.waitForLoadState('load');

    const dashboardPageDuration: number = performance.now() - loginPageEndTime;
    logger.info(`dashboard page duration - ${getFormattedTimeInSec(dashboardPageDuration)} seconds`);
    expect(dashboardPageDuration, 'Simplest approach: dashboard page load times').toBeLessThan(thresholds.fullLoad);
});


/**More detailed approach to measure response times by listening to browser events of performance 
 * Here LCP - Largest Contentful paint time is measured only for Chromium browsers
 * as load & DomContentLoad times means only for resource loading, we are measuring LCP as a better option to see user interaction time (percieved)
*/
test(
  'TC_LOGIN_051-002 | Performance | Login | Browser timing metrics measurement',
  {
    tag: [
      '@performance',
      '@login',
      '@metrics',
      '@browser-timing',
      '@lcp',
      '@non-functional',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Performance' },

      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Performance Metrics' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_051-002' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Measures detailed login page performance metrics including DOMContentLoaded, full page load time, and Largest Contentful Paint (LCP) where supported, and validates them against configured thresholds.',
      },
    ],
  }, async ({ page, browserName, logger }, testInfo) => {  
  const pageMetrics: PageLoadPerfMetricsType = await measurePagePerformance(
    page,
    browserName,
    testInfo,
    '/web/index.php/auth/login'    
  );

  logger.info(pageMetrics, `metrics got after listening to browser events for performance`);

  // --- Assertions ---
  if (thresholds.lcp && pageMetrics.lcp) 
    expect(pageMetrics.lcp, 'Detailed approach: Largest Contentful Pain (LCP) is too slow').toBeLessThan(thresholds.lcp);
  
  expect(pageMetrics.fullLoad, 'Detailed approach: Full resource loading is very slow').toBeLessThan(thresholds.fullLoad);
  expect(pageMetrics.domContentLoaded, 'Detailed approach: Only DOM loading is very slow').toBeLessThan(thresholds.domContentLoaded);
  
})

/*Running lighthouse tool on chromium browser by running in debugging mode*/
test(
  'TC_LOGIN_051-003 | Performance | Login | Lighthouse performance audit',
  {
    tag: [
      '@performance',
      '@login',
      '@lighthouse',
      '@metrics',
      '@non-functional',
      '@chromium-only',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Performance' },

      // Functional hierarchy
      { type: 'feature', description: 'Authentication' },
      { type: 'story', description: 'Login' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Lighthouse Audits' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_051-003' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Runs a Google Lighthouse performance audit against the login page and verifies that the overall performance score is acceptable.',
      },
    ],
  }, async ({logger}) => {  
  /*BUG: LCP is consistently a larger number which needs to be fixed by engineering team*/
  test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  const chromeDebuggingPort: number = 9222;
  const browser: Browser = await launchChromiumInDebug(chromeDebuggingPort);
  const page: Page = await browser.newPage();
  const loginPage:LoginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();  

  const report: LighthouseMetricsPerformanceReport | null = await measureLighthousePerfMetrics(page, chromeDebuggingPort)

  if(report)   logger.info(report, `Login Page : lighthouse performance metrics results report`);
  else logger.warn(`Login Page : Did not get the lighthouse performance metrics report`);
  
  expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for Login Page').not.toBe('BAD');
});


/**
 * Measures dashboard page performance using Google Lighthouse running
 * against a Chromium instance launched in remote debugging mode.
 *
 * Test flow:
 * 1. Launch Chromium with remote debugging enabled.
 * 2. Navigate to the login page.
 * 3. Authenticate as a valid user.
 * 4. Run Lighthouse against the dashboard page.
 * 5. Verify the overall performance rating is acceptable.
 */
test(
  'TC_LOGIN_051-004 | Performance | Dashboard | Lighthouse performance audit',
  {
    tag: [
      '@performance',
      '@dashboard',
      '@lighthouse',
      '@metrics',
      '@non-functional',
      '@chromium-only',
    ],
    annotation: [
      // Quality / business area
      { type: 'epic', description: 'Performance' },

      // Functional hierarchy
      { type: 'feature', description: 'Dashboard' },
      { type: 'story', description: 'Page Load Performance' },

      // Optional grouping in Allure Suites tab
      { type: 'suite', description: 'Lighthouse Audits' },

      // Business criticality
      { type: 'severity', description: 'normal' },

      // External traceability
      { type: 'testCaseId', description: 'TC_LOGIN_051-004' },

      // Human-readable description
      {
        type: 'description',
        description:
          'Runs a Google Lighthouse performance audit against the authenticated dashboard page and verifies that the overall performance score is acceptable.',
      },
    ],
  }, async ({logger}) => {  
  /*BUG: LCP is consistently a larger number which needs to be fixed by engineering team*/
  test.fail(true, 'Known bug in the app. Developers are to be notified'); //marking it as failure as this test case will fail all the time till fixed
  const chromeDebuggingPort: number = 9333;
  const browser: Browser = await launchChromiumInDebug(chromeDebuggingPort);

  const page: Page = await browser.newPage();
  const loginPage:LoginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();  
  await loginPage.signInWithCredentials({username, password});

  const report: LighthouseMetricsPerformanceReport | null = await measureLighthousePerfMetrics(page, chromeDebuggingPort)

  if(report) logger.info(report, `Dashboard Page : lighthouse performance metrics results report`);
  else logger.warn(`Dashboard Page : Did not get the lighthouse performance metrics report`);

  expect.soft(report?.overall, 'Chrome Lighthouse approach: Overall Performance score is NOT meeting expectations for DASHBOARD page').not.toBe('BAD');
});


