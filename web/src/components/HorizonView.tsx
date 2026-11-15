// Portions of this file were generated with SI assistance (see SI_USE.md)
/**
 * Portions of this file were generated with AI assistance.
 * LunaSite 360° Panoramic Horizon View.
 * Renders LOLA DEM terrain horizon silhouette, Sun & Earth tracks, time scrubber, and visibility telemetry.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LoadedSiteData } from '../data/loader';
import { ObserverHeight } from '../types';
import { calculateSolarDiscFraction } from '../metrics/engine';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sun, 
  Radio, 
  Compass, 
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Layers
} from 'lucide-react';

interface HorizonViewProps {
  sitesData: LoadedSiteData[];
  selectedSiteId: string;
  onSelectSiteId: (id: string) => void;
  startIndex: number;
  endIndex: number;
  observerHeight: ObserverHeight;
  onObserverHeightChange: (h: ObserverHeight) => void;
  initialEpoch?: number;
}

export const HorizonView: React.FC<HorizonViewProps> = ({
  sitesData,
  selectedSiteId,
  onSelectSiteId,
  startIndex,
  endIndex,
  observerHeight,
  onObserverHeightChange,
  initialEpoch
}) => {
  const currentSite = useMemo(() => {
    return sitesData.find((s) => s.meta.id === selectedSiteId) || sitesData[0] || null;
  }, [sitesData, selectedSiteId]);

  const [currentEpoch, setCurrentEpoch] = useState<number>(initialEpoch ?? startIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(10); // epochs per tick
  const [showMastComparison, setShowMastComparison] = useState<boolean>(true);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // Keep current epoch within current date range bounds
  useEffect(() => {
    if (initialEpoch !== undefined) {
      setCurrentEpoch(initialEpoch);
    } else if (currentEpoch < startIndex || currentEpoch > endIndex) {
      setCurrentEpoch(startIndex);
    }
  }, [startIndex, endIndex, initialEpoch]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const tick = (now: number) => {
      if (now - lastTickRef.current > 50) { // ~20 fps
        lastTickRef.current = now;
        setCurrentEpoch((prev) => {
          const next = prev + playSpeed;
          if (next > endIndex) {
            return startIndex; // loop back
          }
          return next;
        });
      }
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playSpeed, startIndex, endIndex]);

  if (!currentSite) {
    return (
      <div className="p-8 text-center text-slate-400 bg-lunar-900/40 rounded-xl border border-lunar-800">
        Loading candidate site topographic horizons...
      </div>
    );
  }

  // Active horizon profiles
  const horizon2m = currentSite.meta.horizon_profile_default || [];
  const horizon10m = currentSite.meta.horizon_profile_mast || horizon2m;
  const activeHorizon = observerHeight === '10m' ? horizon10m : horizon2m;

  // Current epoch coordinates
  const epochIdx = Math.min(currentSite.numSteps - 1, Math.max(0, currentEpoch));
  const sAz = currentSite.sunAzimuths[epochIdx];
  const sEl = currentSite.sunElevations[epochIdx];
  const eAz = currentSite.earthAzimuths[epochIdx];
  const eEl = currentSite.earthElevations[epochIdx];

  const currentMs = currentSite.startMs + epochIdx * currentSite.stepMs;
  const currentUtcString = new Date(currentMs).toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  // Azimuth bin (0 to 359)
  const sBin = Math.floor(sAz) % 360;
  const eBin = Math.floor(eAz) % 360;
  const sHorizonElev = activeHorizon[sBin >= 0 ? sBin : 0] ?? 0.0;
  const eHorizonElev = activeHorizon[eBin >= 0 ? eBin : 0] ?? 0.0;

  // Visibility status
  const sunFraction = calculateSolarDiscFraction(sEl, sHorizonElev);
  const isSunVisible = sunFraction > 0.05;
  const isEarthVisible = (eEl + 0.95) > eHorizonElev; // 1.9° diameter -> +0.95° radius

  // Canvas Viewport Coordinate Mapping:
  // Azimuth: 0° to 360° (left to right)
  // Elevation: -6° to +16° (bottom to top, total span = 22°)
  const EL_MIN = -6.0;
  const EL_MAX = 16.0;
  const EL_SPAN = EL_MAX - EL_MIN;

  const azToX = (azDeg: number, width: number) => {
    const normAz = ((azDeg % 360) + 360) % 360;
    return (normAz / 360.0) * width;
  };

  const elToY = (elDeg: number, height: number) => {
    // Top of canvas is 0 (EL_MAX), bottom is height (EL_MIN)
    const normEl = (elDeg - EL_MIN) / EL_SPAN;
    return height - normEl * height;
  };

  // Build SVG path for terrain silhouette (360 degrees)
  const widthSvg = 1000;
  const heightSvg = 400;

  const buildHorizonPath = (horizonProfile: number[]) => {
    if (horizonProfile.length === 0) return '';
    let d = `M 0 ${heightSvg}`;
    // Start at left bottom
    d += ` L 0 ${elToY(horizonProfile[0] ?? 0, heightSvg)}`;
    for (let az = 0; az < 360; az++) {
      const x = azToX(az, widthSvg);
      const y = elToY(horizonProfile[az] ?? 0, heightSvg);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    // Finish at 360°
    d += ` L ${widthSvg} ${elToY(horizonProfile[0] ?? 0, heightSvg)}`;
    d += ` L ${widthSvg} ${heightSvg} Z`;
    return d;
  };

  const terrainPath2m = buildHorizonPath(horizon2m);
  const terrainPath10m = buildHorizonPath(horizon10m);
  const activeTerrainPath = observerHeight === '10m' ? terrainPath10m : terrainPath2m;

  // Compute 24-hour Sun track (48 steps around current epoch)
  const sunTrackPoints: { x: number; y: number }[] = [];
  const trackWindow = 48; // 24 hours
  for (let offset = -trackWindow / 2; offset <= trackWindow / 2; offset += 2) {
    const idx = Math.min(currentSite.numSteps - 1, Math.max(0, epochIdx + offset));
    const az = currentSite.sunAzimuths[idx];
    const el = currentSite.sunElevations[idx];
    sunTrackPoints.push({ x: azToX(az, widthSvg), y: elToY(el, heightSvg) });
  }

  // Compute 14-day Earth libration track (336 steps)
  const earthTrackPoints: { x: number; y: number }[] = [];
  const earthTrackWindow = 336; // 7 days each way
  for (let offset = -earthTrackWindow / 2; offset <= earthTrackWindow / 2; offset += 12) {
    const idx = Math.min(currentSite.numSteps - 1, Math.max(0, epochIdx + offset));
    const az = currentSite.earthAzimuths[idx];
    const el = currentSite.earthElevations[idx];
    earthTrackPoints.push({ x: azToX(az, widthSvg), y: elToY(el, heightSvg) });
  }

  const sunX = azToX(sAz, widthSvg);
  const sunY = elToY(sEl, heightSvg);
  const earthX = azToX(eAz, widthSvg);
  const earthY = elToY(eEl, heightSvg);

  // Azimuth cardinal markers
  const cardinalPoints = [
    { label: '0° N', az: 0 },
    { label: '45° NE', az: 45 },
    { label: '90° E', az: 90 },
    { label: '135° SE', az: 135 },
    { label: '180° S', az: 180 },
    { label: '225° SW', az: 225 },
    { label: '270° W', az: 270 },
    { label: '315° NW', az: 315 },
    { label: '360° N', az: 360 }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Toolbar: Site Switcher, Observer Mast Toggle, Status Overview */}
      <div className="bg-lunar-900/60 border border-lunar-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-100">
              360° Topographic Horizon & Celestial Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Ray-marched from NASA LOLA DEM. Visualizes low-elevation solar skimming and lunar libration Earth line-of-sight.
          </p>
        </div>

        {/* Site Switcher & Mast Height Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Site Selector */}
          <select
            value={selectedSiteId}
            onChange={(e) => onSelectSiteId(e.target.value)}
            className="bg-lunar-950 border border-lunar-750 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:border-amber-500 focus:outline-none"
          >
            {sitesData.map((s) => (
              <option key={s.meta.id} value={s.meta.id}>
                {s.meta.name} ({s.meta.lat_deg.toFixed(2)}°S)
              </option>
            ))}
          </select>

          {/* Mast Height Toggle */}
          <div className="flex items-center bg-lunar-950 border border-lunar-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onObserverHeightChange('2m')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                observerHeight === '2m'
                  ? 'bg-amber-500 text-lunar-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2.0m Sensor
            </button>
            <button
              onClick={() => onObserverHeightChange('10m')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                observerHeight === '10m'
                  ? 'bg-amber-500 text-lunar-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              10.0m Mast
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Horizon Canvas / SVG Panorama */}
      <div className="bg-lunar-950 border border-lunar-800 rounded-xl overflow-hidden shadow-2xl relative">
        
        {/* Top Info Overlay: Real-time Telemetry Readouts */}
        <div className="bg-lunar-900/90 backdrop-blur border-b border-lunar-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-4 z-10 relative">
          
          {/* Current Timestamp */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-xs font-semibold text-slate-100">{currentUtcString}</span>
            <span className="text-xs text-slate-500">|</span>
            <span className="text-xs text-slate-300 font-medium">{currentSite.meta.name}</span>
          </div>

          {/* Sun Telemetry Badge */}
          <div className="flex items-center gap-2.5 bg-lunar-950/70 border border-lunar-800 px-3 py-1.5 rounded-lg">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[11px] font-mono leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Sun:</span>
                <span className="text-amber-300 font-bold">{sEl.toFixed(2)}° el</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">{sAz.toFixed(1)}° az</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] mt-0.5">
                {isSunVisible ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {sunFraction > 0.95 ? 'FULL SUNLIGHT (100%)' : `GRAZING (${(sunFraction * 100).toFixed(0)}%)`}
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    OCCULTED (Horizon: {sHorizonElev.toFixed(2)}°)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Earth Telemetry Badge */}
          <div className="flex items-center gap-2.5 bg-lunar-950/70 border border-lunar-800 px-3 py-1.5 rounded-lg">
            <Radio className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-[11px] font-mono leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Earth:</span>
                <span className="text-cyan-300 font-bold">{eEl.toFixed(2)}° el</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">{eAz.toFixed(1)}° az</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] mt-0.5">
                {isEarthVisible ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    DIRECT-TO-EARTH LINK OK
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    MASKED BY TERRAIN ({eHorizonElev.toFixed(2)}°)
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 360° Sky Canvas & Terrain Polygon */}
        <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-[#030712] via-[#090d16] to-[#0f172a]">
          <svg
            viewBox={`0 0 ${widthSvg} ${heightSvg}`}
            preserveAspectRatio="none"
            className="w-full h-full select-none"
          >
            <defs>
              {/* Lunar terrain gradient */}
              <linearGradient id="terrainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#0f172a" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#020617" stopOpacity="1.0" />
              </linearGradient>

              {/* Sun radial glow */}
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#d97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </radialGradient>

              {/* Earth radial glow */}
              <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="1" />
                <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="80%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid Lines: Elevation Grids */}
            {[0, 5, 10, 15].map((el) => {
              const y = elToY(el, heightSvg);
              const isZero = el === 0;
              return (
                <g key={el}>
                  <line
                    x1="0"
                    y1={y}
                    x2={widthSvg}
                    y2={y}
                    stroke={isZero ? '#475569' : '#1e293b'}
                    strokeDasharray={isZero ? '4 4' : '2 4'}
                    strokeWidth={isZero ? '1.5' : '1'}
                  />
                  <text
                    x="8"
                    y={y - 4}
                    fill={isZero ? '#94a3b8' : '#475569'}
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {isZero ? '0° Flat Horizon' : `+${el}°`}
                  </text>
                </g>
              );
            })}

            {/* Grid Lines: Cardinal Azimuth Markers */}
            {cardinalPoints.map((cp) => {
              const x = azToX(cp.az, widthSvg);
              return (
                <g key={cp.az}>
                  <line
                    x1={x}
                    y1="0"
                    x2={x}
                    y2={heightSvg}
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                  <text
                    x={x}
                    y="16"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {cp.label}
                  </text>
                </g>
              );
            })}

            {/* Earth Libration 14-day Track Arc */}
            {earthTrackPoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.4"
                points={earthTrackPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
              />
            )}

            {/* Sun 24-hour Track Arc */}
            {sunTrackPoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.4"
                points={sunTrackPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
              />
            )}

            {/* LOLA DEM Terrain Silhouette Polygon (Filled Surface) */}
            <path
              d={activeTerrainPath}
              fill="url(#terrainGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeOpacity="0.8"
            />

            {/* Optional 10m Mast horizon ghost line if in 2m mode */}
            {showMastComparison && observerHeight === '2m' && (
              <path
                d={terrainPath10m}
                fill="none"
                stroke="#34d399"
                strokeWidth="1.2"
                strokeDasharray="4 2"
                strokeOpacity="0.6"
              />
            )}

            {/* Celestial Bodies */}

            {/* 1. Earth Disc (1.9° angular diameter) */}
            <g transform={`translate(${earthX}, ${earthY})`}>
              <circle r="18" fill="url(#earthGlow)" opacity={isEarthVisible ? "1.0" : "0.35"} />
              <circle r="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text
                x="12"
                y="-6"
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Earth ({eEl.toFixed(1)}°)
              </text>
            </g>

            {/* 2. Sun Disc (0.53° angular diameter) */}
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle r="22" fill="url(#sunGlow)" opacity={isSunVisible ? "1.0" : "0.3"} />
              <circle r="8" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              <text
                x="14"
                y="-6"
                fill="#fbbf24"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Sun ({sEl.toFixed(1)}°)
              </text>
            </g>

          </svg>

          {/* Legend Overlay at bottom-left */}
          <div className="absolute bottom-3 left-4 bg-lunar-950/80 backdrop-blur border border-lunar-800 rounded-lg px-3 py-2 text-[10px] font-mono text-slate-300 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
              <span>Active Horizon ({observerHeight})</span>
            </div>
            {showMastComparison && observerHeight === '2m' && (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-3 h-0.5 border-b border-dashed border-emerald-400 inline-block"></span>
                <span>10m Mast Horizon Drop</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-3 h-0.5 border-b border-dashed border-slate-500 inline-block"></span>
              <span>0° Flat Moon Horizon</span>
            </div>
          </div>

          {/* Quick Compass Guide at bottom-right */}
          <div className="absolute bottom-3 right-4 bg-lunar-950/80 backdrop-blur border border-lunar-800 rounded-lg px-3 py-2 text-[10px] font-mono text-slate-400 hidden sm:block">
            <span>Azimuth: 0° N (Prime Meridian) → 90° E → 180° S → 270° W</span>
          </div>

        </div>

        {/* 3. Time Scrubber & Playback Controls Bar */}
        <div className="bg-lunar-900 border-t border-lunar-800 p-4 space-y-3">
          
          <div className="flex items-center justify-between gap-4">
            
            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg font-semibold flex items-center gap-1.5 text-xs transition-all ${
                  isPlaying
                    ? 'bg-amber-500 text-lunar-950 shadow-md shadow-amber-500/20'
                    : 'bg-lunar-800 text-slate-200 hover:bg-lunar-750'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play Simulation'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentEpoch(startIndex);
                }}
                title="Reset to start of range"
                className="p-2 rounded-lg bg-lunar-800 text-slate-400 hover:text-slate-200 hover:bg-lunar-750 transition-all text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1 bg-lunar-950 border border-lunar-800 rounded-lg p-1 text-[11px] font-mono">
              <span className="text-slate-500 px-1 text-[10px] uppercase">Speed:</span>
              {[
                { label: '1x (Real)', step: 1 },
                { label: '10x', step: 10 },
                { label: '48x (24h/s)', step: 48 },
                { label: '120x', step: 120 }
              ].map((sp) => (
                <button
                  key={sp.step}
                  onClick={() => setPlaySpeed(sp.step)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    playSpeed === sp.step
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sp.label}
                </button>
              ))}
            </div>

            {/* Mast Comparison Toggle */}
            <button
              onClick={() => setShowMastComparison(!showMastComparison)}
              className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all hidden md:flex items-center gap-1.5 ${
                showMastComparison
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-lunar-950 border-lunar-800 text-slate-400'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Show 10m Mast Overlay</span>
            </button>

          </div>

          {/* Time Scrubber Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min={startIndex}
              max={endIndex}
              value={currentEpoch}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentEpoch(parseInt(e.target.value, 10));
              }}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-lunar-950 rounded-lg border border-lunar-800"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>{new Date(currentSite.startMs + startIndex * currentSite.stepMs).toISOString().substring(0, 10)}</span>
              <span className="text-amber-400 font-semibold">{currentUtcString}</span>
              <span>{new Date(currentSite.startMs + endIndex * currentSite.stepMs).toISOString().substring(0, 10)}</span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Educational Insight & Topographic Note */}
      <div className="bg-lunar-900/40 border border-lunar-800 rounded-xl p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-100">
            How South Pole Topography Dictates Landing Mission Viability:
          </p>
          <p className="leading-relaxed text-slate-400">
            Notice how the Sun skims across the horizon in a nearly horizontal 360° circle over the course of a 29.5-day lunar synodic month. Even modest crater rims and massifs rising 1° to 3° create massive shadow corridors. 
            Elevating solar panels to a 10.0m mast (green dashed line) can drop the local horizon by up to ~1.0°, recapturing sunlight that would otherwise be occulted on the lunar surface.
          </p>
        </div>
      </div>

    </div>
  );
};
