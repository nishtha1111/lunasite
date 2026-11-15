// Portions of this file were generated with SI assistance (see SI_USE.md)
/**
 * Portions of this file were generated with AI assistance.
 * High-performance Canvas Timeline Ribbon for multi-site ephemeris visualization.
 */

import React, { useRef, useEffect } from 'react';
import { LoadedSiteData } from '../data/loader';
import { calculateSolarDiscFraction } from '../metrics/engine';

interface TimelineRibbonProps {
  siteData: LoadedSiteData;
  startIndex: number;
  endIndex: number;
  hoverFraction: number | null;
  onHoverFractionChange: (fraction: number | null) => void;
  height?: number;
  horizonProfile?: number[];
}

export const TimelineRibbon: React.FC<TimelineRibbonProps> = ({
  siteData,
  startIndex,
  endIndex,
  hoverFraction,
  onHoverFractionChange,
  height = 48,
  horizonProfile
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const canvasHeight = height;

    canvas.width = width * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = '#06080d';
    ctx.fillRect(0, 0, width, canvasHeight);

    const span = Math.max(1, endIndex - startIndex);
    const sunTrackHeight = (canvasHeight - 6) / 2;
    const earthTrackHeight = sunTrackHeight;

    const sunElevations = siteData.sunElevations;
    const sunAzimuths = siteData.sunAzimuths;
    const earthElevations = siteData.earthElevations;
    const earthAzimuths = siteData.earthAzimuths;
    const horizon = horizonProfile || siteData.meta.horizon_profile_default || [];

    // Draw background tracks
    ctx.fillStyle = '#0d131f';
    ctx.fillRect(0, 0, width, sunTrackHeight);
    ctx.fillRect(0, sunTrackHeight + 2, width, earthTrackHeight);

    // Draw pixel column slices
    const numCols = Math.min(width, span);
    const stepSize = span / numCols;

    for (let col = 0; col < numCols; col++) {
      const idx = Math.min(siteData.numSteps - 1, Math.floor(startIndex + col * stepSize));
      const x = (col / numCols) * width;
      const colW = Math.max(1, width / numCols + 0.5);

      const sAz = sunAzimuths[idx];
      const sEl = sunElevations[idx];
      const sBin = Math.floor(sAz) % 360;
      const sH = horizon[sBin >= 0 ? sBin : 0] ?? 0.0;
      const sFraction = calculateSolarDiscFraction(sEl, sH);

      if (sFraction > 0.05) {
        ctx.fillStyle = `rgba(245, 158, 11, ${Math.min(1.0, sFraction * 0.9 + 0.1)})`;
        ctx.fillRect(x, 0, colW, sunTrackHeight);
      }

      const eAz = earthAzimuths[idx];
      const eEl = earthElevations[idx];
      const eBin = Math.floor(eAz) % 360;
      const eH = horizon[eBin >= 0 ? eBin : 0] ?? 0.0;
      const isEarthVis = (eEl + 0.95) > eH;

      if (isEarthVis) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
        ctx.fillRect(x, sunTrackHeight + 2, colW, earthTrackHeight);
      }
    }

    // Draw hover cursor line
    if (hoverFraction !== null && hoverFraction >= 0 && hoverFraction <= 1) {
      const cursorX = hoverFraction * width;
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cursorX, 0);
      ctx.lineTo(cursorX, canvasHeight);
      ctx.stroke();
    }
  }, [siteData, startIndex, endIndex, hoverFraction, height, horizonProfile]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onHoverFractionChange(frac);
  };

  const handleMouseLeave = () => {
    onHoverFractionChange(null);
  };

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-12 rounded cursor-crosshair border border-lunar-800/80 hover:border-lunar-700 transition-colors"
      />
    </div>
  );
};
