/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Core Scientific Metrics & Mission Viability Scoring Engine.
 */

import { SiteMetrics, ViabilityWeights, MissionPreset } from '../types';

export const MISSION_PRESETS: Record<MissionPreset, { label: string; weights: ViabilityWeights; description: string }> = {
  rover: {
    label: 'Rover Mission',
    weights: { sunlit: 40, minDarkness: 35, dwe: 15, minOutage: 10 },
    description: 'Prioritizes continuous solar illumination and avoiding deep freezing darkness to protect battery and mobility.'
  },
  lander: {
    label: 'Static Lander',
    weights: { sunlit: 30, minDarkness: 20, dwe: 30, minOutage: 20 },
    description: 'Balanced profile supporting stationary solar science operations and consistent direct downlink telemetry.'
  },
  crewed: {
    label: 'Crewed Surface Stay',
    weights: { sunlit: 25, minDarkness: 25, dwe: 30, minOutage: 20 },
    description: 'Artemis-aligned profile prioritizing mission-critical communication line-of-sight and thermal margins.'
  },
  education: {
    label: 'Education Mode',
    weights: { sunlit: 25, minDarkness: 25, dwe: 25, minOutage: 25 },
    description: 'Balanced equal-weight scoring designed for intuitive student exploration and concept learning.'
  }
};

/**
 * Partial visibility fraction for the solar disc (0.53° angular diameter).
 * @param elevationDeg Solar center elevation in degrees
 * @param horizonDeg Terrain/flat horizon elevation in degrees
 * @returns Visibility fraction from 0.0 (eclipsed) to 1.0 (fully visible)
 */
export function calculateSolarDiscFraction(elevationDeg: number, horizonDeg: number = 0.0): number {
  const radiusDeg = 0.265; // ~0.53° diameter / 2
  const topLimb = elevationDeg + radiusDeg;
  const bottomLimb = elevationDeg - radiusDeg;

  if (bottomLimb >= horizonDeg) {
    return 1.0;
  }
  if (topLimb <= horizonDeg) {
    return 0.0;
  }
  // Linear chord-segment geometric approximation for smooth transition
  const visibleSpan = topLimb - horizonDeg;
  const totalSpan = 2.0 * radiusDeg;
  const fraction = visibleSpan / totalSpan;
  return Math.max(0.0, Math.min(1.0, fraction));
}

/**
 * Calculates the longest contiguous duration (in hours) matching the predicate.
 */
export function calculateLongestContinuousRun(
  flags: boolean[],
  targetValue: boolean,
  stepHours: number = 0.5
): number {
  let maxCount = 0;
  let currentCount = 0;

  for (let i = 0; i < flags.length; i++) {
    if (flags[i] === targetValue) {
      currentCount++;
      if (currentCount > maxCount) {
        maxCount = currentCount;
      }
    } else {
      currentCount = 0;
    }
  }

  return maxCount * stepHours;
}

/**
 * Counts discrete contiguous periods matching targetValue whose duration exceeds minHours.
 */
export function countPeriodsLongerThan(
  flags: boolean[],
  targetValue: boolean,
  minHours: number,
  stepHours: number = 0.5
): number {
  let periods = 0;
  let currentCount = 0;
  const thresholdSteps = minHours / stepHours;

  for (let i = 0; i < flags.length; i++) {
    if (flags[i] === targetValue) {
      currentCount++;
    } else {
      if (currentCount > thresholdSteps) {
        periods++;
      }
      currentCount = 0;
    }
  }

  if (currentCount > thresholdSteps) {
    periods++;
  }

  return periods;
}

/**
 * Counts the number of discrete active windows (rising edges).
 */
export function countActiveWindows(flags: boolean[]): number {
  let windows = 0;
  let insideWindow = false;

  for (let i = 0; i < flags.length; i++) {
    if (flags[i] && !insideWindow) {
      windows++;
      insideWindow = true;
    } else if (!flags[i]) {
      insideWindow = false;
    }
  }

  return windows;
}

/**
 * Computes all LunaSite metrics and explainable Viability Score for a site over a slice of data.
 */
export function computeSiteMetrics(
  siteId: string,
  siteName: string,
  sunElevations: Float32Array | number[],
  sunAzimuths: Float32Array | Uint16Array | number[],
  earthElevations: Float32Array | number[],
  earthAzimuths: Float32Array | Uint16Array | number[],
  horizonProfile: number[] | null = null,
  weights: ViabilityWeights = MISSION_PRESETS.lander.weights,
  stepHours: number = 0.5
): SiteMetrics {
  const n = sunElevations.length;
  if (n === 0) {
    return {
      siteId,
      siteName,
      sunlitFractionPct: 0,
      longestDarknessHours: 0,
      darkPeriodsOver48h: 0,
      longestSunlightHours: 0,
      earthVisiblePct: 0,
      longestCommOutageHours: 0,
      commWindowsCount: 0,
      overlapPct: 0,
      missionViabilityScore: 0,
      scoreBreakdown: { sunlitComponent: 0, darknessPenalty: 0, dweComponent: 0, outagePenalty: 0 }
    };
  }

  const sunVisibleFlags = new Array<boolean>(n);
  const earthVisibleFlags = new Array<boolean>(n);
  const overlapFlags = new Array<boolean>(n);

  let sunlitSum = 0;
  let earthVisibleCount = 0;
  let overlapCount = 0;

  for (let i = 0; i < n; i++) {
    const sAz = sunAzimuths[i];
    const sEl = sunElevations[i];
    const eAz = earthAzimuths[i];
    const eEl = earthElevations[i];

    // Determine horizon elevation at azimuth bin (0 to 359)
    let sHorizon = 0.0;
    let eHorizon = 0.0;
    if (horizonProfile && horizonProfile.length === 360) {
      const sBin = Math.floor(sAz) % 360;
      const eBin = Math.floor(eAz) % 360;
      sHorizon = horizonProfile[sBin >= 0 ? sBin : 0] ?? 0.0;
      eHorizon = horizonProfile[eBin >= 0 ? eBin : 0] ?? 0.0;
    }

    // Solar disc visibility fraction
    const sFraction = calculateSolarDiscFraction(sEl, sHorizon);
    sunlitSum += sFraction;
    const isSunlit = sFraction > 0.1; // active solar generation threshold
    sunVisibleFlags[i] = isSunlit;

    // Earth disc line-of-sight (diameter 1.9°, radius 0.95°)
    const isEarthVis = (eEl + 0.95) > eHorizon;
    earthVisibleFlags[i] = isEarthVis;
    if (isEarthVis) {
      earthVisibleCount++;
    }

    // Power + Comm overlap
    const isOverlap = isSunlit && isEarthVis;
    overlapFlags[i] = isOverlap;
    if (isOverlap) {
      overlapCount++;
    }
  }

  const sunlitFractionPct = (sunlitSum / n) * 100.0;
  const earthVisiblePct = (earthVisibleCount / n) * 100.0;
  const overlapPct = (overlapCount / n) * 100.0;

  const longestDarknessHours = calculateLongestContinuousRun(sunVisibleFlags, false, stepHours);
  const darkPeriodsOver48h = countPeriodsLongerThan(sunVisibleFlags, false, 48.0, stepHours);
  const longestSunlightHours = calculateLongestContinuousRun(sunVisibleFlags, true, stepHours);

  const longestCommOutageHours = calculateLongestContinuousRun(earthVisibleFlags, false, stepHours);
  const commWindowsCount = countActiveWindows(earthVisibleFlags);

  // Calculate Explainable Mission Viability Score (0 to 100)
  // S_sunlit in [0, 100]
  const sunlitScore = sunlitFractionPct;

  // S_darkness: 100 * exp(-D_dark / 72 hours)
  const darknessScore = 100.0 * Math.exp(-longestDarknessHours / 72.0);

  // S_dwe in [0, 100]
  const dweScore = earthVisiblePct;

  // S_outage: 100 * exp(-O_comm / 168 hours [7 days])
  const outageScore = 100.0 * Math.exp(-longestCommOutageHours / 168.0);

  const totalWeight = weights.sunlit + weights.minDarkness + weights.dwe + weights.minOutage;
  const weightedSum =
    weights.sunlit * sunlitScore +
    weights.minDarkness * darknessScore +
    weights.dwe * dweScore +
    weights.minOutage * outageScore;

  const missionViabilityScore = totalWeight > 0 ? Math.min(100.0, Math.max(0.0, weightedSum / totalWeight)) : 0.0;

  return {
    siteId,
    siteName,
    sunlitFractionPct: Math.round(sunlitFractionPct * 10) / 10,
    longestDarknessHours: Math.round(longestDarknessHours * 10) / 10,
    darkPeriodsOver48h,
    longestSunlightHours: Math.round(longestSunlightHours * 10) / 10,
    earthVisiblePct: Math.round(earthVisiblePct * 10) / 10,
    longestCommOutageHours: Math.round(longestCommOutageHours * 10) / 10,
    commWindowsCount,
    overlapPct: Math.round(overlapPct * 10) / 10,
    missionViabilityScore: Math.round(missionViabilityScore * 10) / 10,
    scoreBreakdown: {
      sunlitComponent: Math.round(sunlitScore * 10) / 10,
      darknessPenalty: Math.round(darknessScore * 10) / 10,
      dweComponent: Math.round(dweScore * 10) / 10,
      outagePenalty: Math.round(outageScore * 10) / 10
    }
  };
}
