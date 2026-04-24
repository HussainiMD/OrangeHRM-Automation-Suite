import { Page, TestInfo } from '../tests/base';
import baseLogger from './logger';
import { PageLoadPerfMetricsType } from './types/PageLoadPerfMetricsType';

/**We are measuring page performance  on different metrics
 * Page state - only dom loaded
 * Page state - fully loaded with all resources
 * LCP - largest content full paint. Painting starts after resources are loaded. It it a complex & parellel process. Of all we are finding the largest paint time. Only chromium browsers support this metric
 */
export async function measurePagePerformance( page: Page, browserName: string, testInfo: TestInfo, url: string): Promise<PageLoadPerfMetricsType> { 

  const start = performance.now();//performance.now() instead of date.now() for machine time agnostic and more precision
  await page.goto(url);

  // DOM ready
  await page.waitForLoadState('domcontentloaded');
  const domContentLoaded = performance.now() - start;

  // Full load
  await page.waitForLoadState('load');
  const fullLoad = performance.now() - start;

  // --- Try LCP (Chromium only) ---
  let lcp: number | undefined;
  let metricUsed: PageLoadPerfMetricsType['metricUsed'] = 'FULL_LOAD';

  if ((/chrom/i).test(browserName)) { //treating project name is a synonym for browser name. Testing for chrome/chromium
    try {
      lcp = await page.evaluate(() => { //evaluate() runs on the browser
        return new Promise<number>((resolve) => {
          let resolved = false;
          let lcpValue = 0;

          /*Browsers allow us to subscribe to various performance event. We will define performance observer. It picks the latest (last) entry and gets startTime */
          const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            lcpValue = entries[entries.length - 1].startTime;
          });

          /*Subscribe to LCP */
          observer.observe({
            type: 'largest-contentful-paint',
            buffered: true,
          });

          const finalize = () => {
            if (!resolved) {
              resolved = true;
              resolve(lcpValue);
            }
          };

          /*We will resolve the promise if the page state changes to hidden (like a tab). But this works only in headed mode */
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') finalize(); //below timeout waits but here we finalize immediately
          });
         
          /* Fallback: resolve after a short delay to capture buffered LCP entries. */
          setTimeout(finalize, 10000);
        });
      });

      /*if extracting LCP is successful then we will update metric used */
      if (lcp && lcp > 0) {
        metricUsed = 'LCP';
      }
    } catch(err) {
      // fallback silently
        baseLogger.warn(err, 'Not evaluating LCP. Browser (project) is ' + browserName);        
    }
  }

  // --- TTFB (Time To First Byte) as another metric to find backend + network lag (cross-browser compatible via navigation API)---
  const ttfb = await page.evaluate(() => {
    /*get first navigation request and get start time*/
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return nav.responseStart;
  });

  /*prepare result JSON to be returned */
  const result: PageLoadPerfMetricsType = {
    lcp,
    fullLoad,
    domContentLoaded,
    ttfb,
    metricUsed,
  };

  
  return result;
}