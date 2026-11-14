/**
 * Portions of this file were generated with AI assistance.
 * LunaSite Compact Binary Data Loader.
 */

import { Manifest, SiteMetadata } from '../types';

export interface LoadedSiteData {
  meta: SiteMetadata;
  numSteps: number;
  startMs: number;
  endMs: number;
  stepSeconds: number;
  stepMs: number;
  sunAzimuths: Float32Array;   // in degrees (0 to 360)
  sunElevations: Float32Array; // in degrees (-90 to +90)
  earthAzimuths: Float32Array; // in degrees (0 to 360)
  earthElevations: Float32Array; // in degrees (-90 to +90)
}

const siteCache = new Map<string, LoadedSiteData>();
let cachedManifest: Manifest | null = null;

export async function fetchManifest(): Promise<Manifest> {
  if (cachedManifest) return cachedManifest;
  const res = await fetch('./data/manifest.json');
  if (!res.ok) {
    throw new Error(`Failed to load manifest: ${res.status} ${res.statusText}`);
  }
  cachedManifest = await res.json();
  return cachedManifest!;
}

export async function loadSiteData(siteId: string): Promise<LoadedSiteData> {
  if (siteCache.has(siteId)) {
    return siteCache.get(siteId)!;
  }

  // Load metadata JSON and dense binary buffer in parallel
  const [metaRes, binRes] = await Promise.all([
    fetch(`./data/${siteId}.json`),
    fetch(`./data/${siteId}.bin`)
  ]);

  if (!metaRes.ok) {
    throw new Error(`Failed to fetch metadata for ${siteId}: ${metaRes.status}`);
  }
  if (!binRes.ok) {
    throw new Error(`Failed to fetch binary data for ${siteId}: ${binRes.status}`);
  }

  const meta: SiteMetadata = await metaRes.json();
  const buffer = await binRes.arrayBuffer();

  const numSteps = meta.num_steps;
  const bytesPerStep = meta.bytes_per_step || 8;
  const expectedBytes = numSteps * bytesPerStep;

  if (buffer.byteLength < expectedBytes) {
    console.warn(`Buffer size (${buffer.byteLength}) is less than expected (${expectedBytes}) for ${siteId}`);
  }

  const dataView = new DataView(buffer);

  const sunAzimuths = new Float32Array(numSteps);
  const sunElevations = new Float32Array(numSteps);
  const earthAzimuths = new Float32Array(numSteps);
  const earthElevations = new Float32Array(numSteps);

  // Buffer layout per step (8 bytes):
  // 0: Uint16 sun_az (scaled x100)
  // 2: Int16  sun_el (scaled x100)
  // 4: Uint16 earth_az (scaled x100)
  // 6: Int16  earth_el (scaled x100)
  for (let i = 0; i < numSteps; i++) {
    const offset = i * 8;
    const sAz = dataView.getUint16(offset, true) / 100.0;
    const sEl = dataView.getInt16(offset + 2, true) / 100.0;
    const eAz = dataView.getUint16(offset + 4, true) / 100.0;
    const eEl = dataView.getInt16(offset + 6, true) / 100.0;

    sunAzimuths[i] = sAz;
    sunElevations[i] = sEl;
    earthAzimuths[i] = eAz;
    earthElevations[i] = eEl;
  }

  const startMs = Date.parse(meta.start_utc + 'Z');
  const endMs = Date.parse(meta.end_utc + 'Z');
  const stepSeconds = meta.step_seconds || 1800;
  const stepMs = stepSeconds * 1000;

  const loadedData: LoadedSiteData = {
    meta,
    numSteps,
    startMs,
    endMs,
    stepSeconds,
    stepMs,
    sunAzimuths,
    sunElevations,
    earthAzimuths,
    earthElevations
  };

  siteCache.set(siteId, loadedData);
  return loadedData;
}

/**
 * Returns epoch slice indices for a given date range.
 */
export function getDateRangeIndices(
  data: LoadedSiteData,
  startDateStr: string,
  endDateStr: string
): { startIndex: number; endIndex: number } {
  const startReqMs = Date.parse(startDateStr + 'T00:00:00Z');
  const endReqMs = Date.parse(endDateStr + 'T23:59:59Z');

  const startIndex = Math.max(0, Math.min(data.numSteps - 1, Math.floor((startReqMs - data.startMs) / data.stepMs)));
  const endIndex = Math.max(0, Math.min(data.numSteps - 1, Math.ceil((endReqMs - data.startMs) / data.stepMs)));

  return { startIndex, endIndex: Math.max(startIndex, endIndex) };
}
