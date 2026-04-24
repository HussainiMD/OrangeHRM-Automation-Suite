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
test('Login and Dashboard Page Response Time', async ({page, logger}) => {        
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
test('Login Page load metrics measurement by using browser events', async ({ page, browserName, logger }, testInfo) => {  
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
test('lighthouse performance metrics for login page', async ({logger}) => {  
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


test('lighthouse performance metrics for dashboard page', async ({logger}) => {  
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


