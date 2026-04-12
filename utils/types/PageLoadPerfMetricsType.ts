export type PageLoadPerfMetricsType = {
  lcp?: number; //optional as this is available only for chromium browser
  fullLoad: number;
  domContentLoaded: number;
  ttfb?: number; //time to first byte - basically time taken by backend and various hops on the network chain
  metricUsed: 'LCP' | 'FULL_LOAD';//LCP is available only in chromium browser, this field indicates that
};