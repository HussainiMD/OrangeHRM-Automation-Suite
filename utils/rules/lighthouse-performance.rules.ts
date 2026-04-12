import { LighthouseMetricStatus } from "../types/lighthouse-performance.types";

export function classifyScore(score: number): LighthouseMetricStatus {
  if (score >= 90) return 'GOOD';
  if (score >= 50) return 'OK';
  return 'BAD';
}

export function classifyLCP(lcp: number): LighthouseMetricStatus {
  if (lcp <= 2500) return 'GOOD';
  if (lcp <= 4000) return 'OK';
  return 'BAD';
}

export function classifyCLS(cls: number): LighthouseMetricStatus {
  if (cls <= 0.1) return 'GOOD';
  if (cls <= 0.25) return 'OK';
  return 'BAD';
}

export function classifyTBT(tbt: number): LighthouseMetricStatus {
  if (tbt <= 200) return 'GOOD';
  if (tbt <= 600) return 'OK';
  return 'BAD';
}

export function classifyFCP(fcp: number): LighthouseMetricStatus {
  if (fcp <= 1800) return 'GOOD';
  if (fcp <= 3000) return 'OK';
  return 'BAD';
}