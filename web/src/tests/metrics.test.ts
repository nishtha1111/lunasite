// Portions of this file were generated with SI assistance (see SI_USE.md)
/**
 * Portions of this file were generated with AI assistance.
 * Unit tests for LunaSite metrics and viability scoring engine.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSolarDiscFraction,
  calculateLongestContinuousRun,
  countPeriodsLongerThan,
  countActiveWindows,
  computeSiteMetrics,
  MISSION_PRESETS
} from '../metrics/engine';

describe('calculateSolarDiscFraction', () => {
  it('returns 1.0 when sun is fully above horizon', () => {
    expect(calculateSolarDiscFraction(1.0, 0.0)).toBe(1.0);
    expect(calculateSolarDiscFraction(5.0, 2.0)).toBe(1.0);
  });

  it('returns 0.0 when sun is fully below horizon', () => {
    expect(calculateSolarDiscFraction(-1.0, 0.0)).toBe(0.0);
    expect(calculateSolarDiscFraction(0.0, 2.0)).toBe(0.0);
  });

  it('returns partial fraction when disc intersects horizon', () => {
    // Horizon at 0.0, Sun center at 0.0 -> exactly 50%
    const mid = calculateSolarDiscFraction(0.0, 0.0);
    expect(mid).toBeCloseTo(0.5, 2);

    // Sun center at +0.1325 (quarter way above)
    const quarter = calculateSolarDiscFraction(0.1325, 0.0);
    expect(quarter).toBeGreaterThan(0.5);
    expect(quarter).toBeLessThan(1.0);
  });
});

describe('calculateLongestContinuousRun', () => {
  it('computes longest run of darkness in hours', () => {
    // 6 steps true (light), 10 steps false (dark), 4 steps true (light)
    const flags = [
      true, true, true, true, true, true,
      false, false, false, false, false, false, false, false, false, false,
      true, true, true, true
    ];
    // 10 steps * 0.5h = 5.0 hours
    const darkHours = calculateLongestContinuousRun(flags, false, 0.5);
    expect(darkHours).toBe(5.0);

    // 6 steps * 0.5h = 3.0 hours
    const sunHours = calculateLongestContinuousRun(flags, true, 0.5);
    expect(sunHours).toBe(3.0);
  });

  it('handles empty and uniform arrays', () => {
    expect(calculateLongestContinuousRun([], false, 0.5)).toBe(0);
    expect(calculateLongestContinuousRun([true, true, true], false, 0.5)).toBe(0);
    expect(calculateLongestContinuousRun([true, true, true], true, 0.5)).toBe(1.5);
  });
});

describe('countPeriodsLongerThan', () => {
  it('counts distinct dark periods exceeding 48 hours', () => {
    // Step is 0.5h, 48h = 96 steps
    const period1 = new Array(100).fill(false); // 50 hours (> 48h)
    const light1 = new Array(20).fill(true);
    const period2 = new Array(50).fill(false);  // 25 hours (< 48h)
    const light2 = new Array(10).fill(true);
    const period3 = new Array(120).fill(false); // 60 hours (> 48h)

    const fullSeries = [...period1, ...light1, ...period2, ...light2, ...period3];
    const count = countPeriodsLongerThan(fullSeries, false, 48.0, 0.5);
    expect(count).toBe(2);
  });
});

describe('countActiveWindows', () => {
  it('counts rising edge comm windows', () => {
    const flags = [false, true, true, false, false, true, false, true, true, true];
    expect(countActiveWindows(flags)).toBe(3);
  });
});

describe('computeSiteMetrics & Mission Viability Score', () => {
  it('evaluates metrics within valid bounds [0, 100]', () => {
    const n = 100;
    const sunEl = new Float32Array(n).fill(2.0); // always sunlit
    const sunAz = new Uint16Array(n).fill(180);
    const earthEl = new Float32Array(n).fill(5.0); // always earth-visible
    const earthAz = new Uint16Array(n).fill(90);

    const metrics = computeSiteMetrics(
      'test_site',
      'Test Site',
      sunEl,
      sunAz,
      earthEl,
      earthAz,
      null,
      MISSION_PRESETS.crewed.weights,
      0.5
    );

    expect(metrics.sunlitFractionPct).toBe(100.0);
    expect(metrics.longestDarknessHours).toBe(0.0);
    expect(metrics.earthVisiblePct).toBe(100.0);
    expect(metrics.longestCommOutageHours).toBe(0.0);
    expect(metrics.overlapPct).toBe(100.0);
    expect(metrics.missionViabilityScore).toBe(100.0);
  });

  it('penalizes severe darkness according to explainable formula', () => {
    const n = 200;
    // 144 hours of continuous darkness
    const sunEl = new Float32Array(n).fill(-2.0);
    const sunAz = new Uint16Array(n).fill(180);
    const earthEl = new Float32Array(n).fill(5.0);
    const earthAz = new Uint16Array(n).fill(90);

    const metrics = computeSiteMetrics(
      'dark_site',
      'Dark Site',
      sunEl,
      sunAz,
      earthEl,
      earthAz,
      null,
      MISSION_PRESETS.rover.weights,
      0.5
    );

    expect(metrics.sunlitFractionPct).toBe(0.0);
    expect(metrics.longestDarknessHours).toBe(100.0); // 200 * 0.5h
    expect(metrics.missionViabilityScore).toBeLessThan(35.0);
  });
});
