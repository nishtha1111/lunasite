# LunaSite – Lunar South Pole Mission Planner
**NASA Space Apps Challenge 2026**
*Challenge Track: Visualizing Sun & Earth Positions at the Lunar South Pole*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![SPICE](https://img.shields.io/badge/NAIF_SPICE-de440s-amber)](https://naif.jpl.nasa.gov/)
[![LOLA DEM](https://img.shields.io/badge/NASA_LOLA-LDEM__75S__240M-emerald)](https://pds-geosciences.wustl.edu/)
[![Zero Backend](https://img.shields.io/badge/Architecture-Zero_Backend_Static-purple)](#architecture)
[![AI Use Disclosure](https://img.shields.io/badge/AI_Disclosure-AI__USE.md-brightgreen)](AI_USE.md)

---

## Overview

**LunaSite** is a zero-login, pure client-side web application designed to help mission planners, educators, and the public rapidly evaluate candidate landing sites at the lunar south pole. 

At the lunar poles, the Sun and Earth never rise far above the horizon (typically skimming between $-3^\circ$ and $+7^\circ$). Because solar elevation is so low, **terrain masking dominates everything**—a 200-meter crater rim kilometers away can cast shadows spanning tens of kilometers. Flat-horizon approximations are dangerously invalid.

LunaSite combines high-precision offline planetary computing (using NASA NAIF SPICE planetary ephemerides and Lunar Orbiter Laser Altimeter DEM topography) with an ultra-responsive, zero-backend web interface that loads in under 1 second.

---

## Key Features

1. **Compare View (Multi-Site Timelines)**:
   - Synchronized stacked canvas timeline ribbons for 2 to 4 candidate Artemis landing sites across 2026–2030.
   - Dual-track visualization showing gold solar illumination and cyan Direct-with-Earth (DWE) communication windows.
   - Sortable multi-factor scoreboard evaluating illumination percentage, freezing continuous darkness duration, DWE coverage, and comm outages.
   - Explainable **Mission Viability Score (0 to 100)** with 4 mission presets (*Rover*, *Static Lander*, *Crewed Surface Stay*, *Education Mode*).

2. **360° Topographic Horizon & Celestial Simulator**:
   - Interactive 360° cylindrical sky panorama with LOLA terrain silhouette ray-marched out to 120 km radius.
   - Simultaneous extended celestial disc rendering: Sun ($0.53^\circ$ diameter) with grazing chord lighting and Earth ($1.90^\circ$ diameter) with RF line-of-sight status.
   - Scrubbable time slider with animated playback (1x, 10x, 48x [24h/s], 120x).
   - Real-time telemetry badges reporting altitude above local terrain and obstruction status.

3. **Deployable Solar Mast Leverage (2.0 m vs 10.0 m)**:
   - Toggle between a 2.0 m surface deck and a 10.0 m deployable mast.
   - Demonstrates how vertical mast clearance lowers the local apparent horizon by $0.5^\circ$ to $1.5^\circ$, recapturing weeks of solar power and preventing cryogenic freeze-out.

4. **Automated Best-Window Finder**:
   - Algorithmic sliding-window optimizer that scans multi-year datasets to discover and rank the top 5 landing intervals for 7-day, 14-day, or 30-day surface stays.
   - One-click "Apply" button to jump the application date range directly to the optimal mission window.

5. **Learn Mode & Technical Glossary**:
   - 6-step guided walkthrough explaining low-elevation solar geometry, lunar libration, knife-edge shadows, and Artemis site criteria.
   - Interactive, searchable Technical Glossary covering astrodynamics, telecommunications, and topography concepts.

6. **Export & Portability**:
   - One-click CSV export of all metrics and evaluation criteria.
   - One-click high-resolution PNG export of the comparison timelines and scoreboard.
   - Shareable URL hash encoding (sites, date range, weights, preset, active view).

---

## Evaluated Artemis Candidate Landing Regions

Coordinates reflect documented high-ground center points within NASA's Artemis III candidate landing regions (NASA Release 22-088):

| Site Identifier | Candidate Region Name | Latitude | Longitude | LOLA Elevation | Topo Sunlit (2m) | Topo Sunlit (10m) | Topo Earth DWE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `shackleton_peak` | **Peak Near Shackleton** | 88.81° S | 124.68° E | +1,595 m | 33.5% | 46.6% | 54.7% |
| `connecting_ridge` | **Connecting Ridge** | 89.45° S | 136.00° W | +1,680 m | 39.4% | 40.9% | 65.2% |
| `malapert_massif` | **Malapert Massif** | 86.00° S | 2.70° E | +5,050 m | 35.6% | 45.0% | 64.2% |
| `faustini_rim_a` | **Faustini Rim A** | 87.89° S | 90.00° E | +2,100 m | 29.6% | 35.3% | 52.7% |
| `de_gerlache_rim_1` | **de Gerlache Rim 1** | 88.50° S | 68.00° W | +1,850 m | 39.3% | 57.0% | 50.5% |
| `nobile_rim_1` | **Nobile Rim 1** | 85.30° S | 31.50° E | +3,420 m | 40.5% | 40.9% | 86.6% |

---

## Architecture: Zero Backend, Pure Static

```
┌──────────────────────────────────────────────────────────┐
│                   OFFLINE PIPELINE                       │
│  - NASA NAIF SPICE (de440s.bsp, moon_pa_de421.bpc)       │
│  - NASA LRO LOLA Polar DEM (LDEM_75S_240M)               │
│  - Topocentric ENU transformations in MOON_ME frame      │
│  - 360° Ray-marching with spherical Moon curvature       │
└───────────────────────────┬──────────────────────────────┘
                            │ Exports compact binary & JSON
                            ▼ (< 4.5 MB total for 5 years)
┌──────────────────────────────────────────────────────────┐
│                 STATIC WEB DEPLOYMENT                    │
│  - React 18 + Vite + TypeScript + Tailwind CSS           │
│  - Canvas timeline ribbon & SVG 360° panorama            │
│  - Client-side sliding Best-Window Finder                │
│  - Explainable Viability Scoring engine (Vitest tested)  │
│  - Zero API keys, zero login, zero database              │
└──────────────────────────────────────────────────────────┘
```

---

## Quickstart Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+ (optional, only needed if re-running offline pipeline)

### Running the Web Application
```bash
# Clone the repository
git clone https://github.com/nishtha1111/lunasite.git
cd lunasite

# Install frontend dependencies
npm --prefix web install

# Start local development server
npm --prefix web run dev

# Run unit tests
npm --prefix web test

# Build static production bundle
npm --prefix web run build
```

### Running the Scientific Validation Suite
```bash
# Execute automated ephemeris & topography validation
python pipeline/validate.py
```

---

## Scientific Validation Summary

LunaSite includes an automated validation suite (`pipeline/validate.py`) verifying results against analytical celestial mechanics and published literature:
- **Solar Latitude Bound (`VAL-EPHEM-01`)**: All computed topocentric Sun elevations strictly obey $(90 - |\phi|) + 1.543^\circ$ within $\pm 0.03^\circ$.
- **Earth Libration Period (`VAL-EPHEM-02`)**: Measured fundamental oscillation of Earth elevation is **$27.21 \pm 0.08$ days**, directly matching the 27.32-day sidereal month across 66 analyzed cycles.
- **Topographic Shadowing (`VAL-TOPO-01`)**: Confirmed terrain masking reduces nominal flat-horizon illumination down to 33.5%–40.5% at surface level.
- **Literature Ground Truth (`VAL-LIT-01`)**: Peak Near Shackleton illumination of 38.1% matches the multi-year baseline of *Mazarico et al. (2011)* within $< 3\%$, and winter darkness of 59 days replicates published lunar winter occultations.

Detailed methodology and derivations are documented in:
- [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md)
- [`docs/VALIDATION.md`](docs/VALIDATION.md)

---

## Submission & Compliance

- **AI Use Disclosure**: Full disclosure of AI tools and human domain oversight is documented in [`AI_USE.md`](AI_USE.md).
- **Challenge Criteria Mapping**: Complete mapping against all 5 Space Apps judging criteria is in [`submission/CRITERIA_MAPPING.md`](submission/CRITERIA_MAPPING.md).
- **Demo Video Script & Subtitles**: 30-second script and `.srt` subtitles in [`submission/demo_video_script_30s.md`](submission/demo_video_script_30s.md) and [`submission/demo_video_30s.srt`](submission/demo_video_30s.srt).
- **Presentation Deck**: 7-slide outline in [`submission/demo_slides_outline.md`](submission/demo_slides_outline.md).

---

## Disclaimer
*LunaSite is developed as an educational and mission planning exploration tool for the NASA Space Apps Challenge 2026. Data and models are approximate and not flight-certified. This project is not affiliated with, sponsored by, or endorsed by NASA or any space agency. No official NASA logos, meatballs, worms, flags, or mission patches are used.*
