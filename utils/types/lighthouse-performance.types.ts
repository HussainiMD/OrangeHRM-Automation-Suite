export type LighthouseMetricStatus = 'GOOD' | 'OK' | 'BAD';

export type LighthouseMetricsEvaluation = {
  value: number;
  status: LighthouseMetricStatus;
};

export type LighthouseMetricsPerformanceReport = {
  performance: LighthouseMetricsEvaluation;
  lcp: LighthouseMetricsEvaluation;
  cls: LighthouseMetricsEvaluation;
  tbt?: LighthouseMetricsEvaluation;
  fcp?: LighthouseMetricsEvaluation;
  overall: LighthouseMetricStatus;
};