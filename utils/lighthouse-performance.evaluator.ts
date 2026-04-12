import { classifyScore, classifyLCP, classifyCLS, classifyTBT, classifyFCP} from './rules/lighthouse-performance.rules';
import { LighthouseMetricsPerformanceReport } from './types/lighthouse-performance.types';

type LightHouseMetrics = {
  performanceScore: number;
  lcp: number;
  cls: number;
  tbt?: number;
  fcp?: number;
};

function getFormattedTimeInSec(num: number) {
    return parseFloat((num/1000).toFixed(2));
}

/*This function prepares an insightful report by using Lighthouse metrics */
export function evaluateLighthousePerformanceMetrics(input: LightHouseMetrics): LighthouseMetricsPerformanceReport {
  const performance = {
    value: getFormattedTimeInSec(input.performanceScore),
    status: classifyScore(input.performanceScore),
  };

  const lcp = {
    value: getFormattedTimeInSec(input.lcp),
    status: classifyLCP(input.lcp),
  };

  const cls = {
    value: getFormattedTimeInSec(input.cls),
    status: classifyCLS(input.cls),
  };

  const tbt = input.tbt !== undefined
    ? {
        value: getFormattedTimeInSec(input.tbt),
        status: classifyTBT(input.tbt),
      }
    : undefined;

  const fcp = input.fcp !== undefined
    ? {
        value: getFormattedTimeInSec(input.fcp),
        status: classifyFCP(input.fcp),
      }
    : undefined;

  // --- overall logic ---
  const statuses = [
    performance.status,
    lcp.status,
    cls.status,
    tbt?.status,
    fcp?.status,
  ].filter(Boolean);

  let overall: LighthouseMetricsPerformanceReport['overall'];

  /*Calculation overall score*/
  if (statuses.includes('BAD')) {
    overall = 'BAD';
  } else if (statuses.includes('OK')) {
    overall = 'OK';
  } else {
    overall = 'GOOD';
  }

  return {
    performance,
    lcp,
    cls,
    tbt,
    fcp,
    overall,
  };
}