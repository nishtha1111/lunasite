# LunaSite – NASA Space Apps Challenge Project Submission Page
**Challenge Category**: Visualizing Sun & Earth Positions at the Lunar South Pole
**Project Name**: LunaSite
**Short Project Tagline**: Rapid, terrain-masked lunar south pole mission planning using NASA LOLA laser altimetry and NAIF SPICE astrodynamics.

---

## 1. Short Description (Under 100 words)
LunaSite is a zero-login, client-side web application that lets mission planners, educators, and the public evaluate lunar south pole landing sites in seconds. At the lunar poles, the Sun and Earth only rise 2° to 7° above the horizon, meaning crater topography dictates mission survival. Powered by offline ray-marching through NASA LOLA digital elevation models and NAIF SPICE ephemerides (2026–2030), LunaSite delivers synchronized solar illumination timelines, Direct-with-Earth comm windows, a 360° panoramic horizon simulator, and an explainable Mission Viability Score—turning complex astrodynamics into intuitive, mission-critical clarity.

---

## 2. Detailed Project Description

### The Challenge: Extreme Lunar South Pole Constraints
NASA’s Artemis campaign will land the next astronauts and robotic scouts near the lunar south pole. However, mission planners face severe environmental constraints:
1. **Low Solar Elevation**: The Moon’s 1.54° axial tilt keeps the Sun skimming along the horizon. Even small ridges cast shadows over dozens of kilometers. A flat-horizon model is dangerously wrong.
2. **Earth Libration Cycles**: Direct-with-Earth (DWE) communication oscillates in a ~27.3-day libration cycle, causing alternating ~14-day visibility and ~14-day blackouts for un-crested sites.
3. **Heavy, Complex Legacy Tools**: Existing mission planning tools require multi-gigabyte workstation installations and steep learning curves, creating barriers for rapid trade-off exploration.

### Our Solution: LunaSite
LunaSite solves this problem by combining high-precision offline planetary computing with an ultra-responsive, accessible client-side interface:
- **Compare View**: Select 2 to 4 candidate Artemis landing sites (e.g. *Peak Near Shackleton*, *Connecting Ridge*, *Malapert Massif*, *Nobile Rim 1*) and instantly inspect stacked solar and comm timelines. A sortable scoreboard evaluates sunlit percentage, continuous darkness, comm windows, and an explainable Mission Viability Score (0–100) with operational presets for Rovers, Landers, and Crewed stays.
- **Horizon 360° Panorama**: An interactive cylindrical sky canvas rendering the real LOLA terrain silhouette. Users can scrub a time slider across 2026–2030, animate celestial motion at 1x to 120x speed, inspect real-time line-of-sight telemetry, and toggle between a 2.0 m lander deck and a 10.0 m deployable mast.
- **Optimal Mission Window Finder**: An automated sliding-window scanner that discovers and ranks the top 5 landing intervals for 7, 14, or 30-day surface stays, with a 1-click "Apply" button to jump to the best window.
- **Learn Mode & Glossary**: A 6-step guided walkthrough and searchable glossary explaining low-elevation solar geometry, permanently shadowed regions (PSRs), and DWE communications for students and educators.

---

## 3. How We Developed LunaSite
- **Astrodynamics Engine (`pipeline/`)**: Built in Python using the official NAIF SPICE toolkit (`spiceypy`). We generated topocentric azimuth and elevation coordinates in the `MOON_ME` body-fixed frame at 30-minute intervals from 2026-01-01 to 2030-12-31 (87,648 epochs) using `de440s.bsp`, `moon_080317.tf`, and `moon_pa_de421_1900-2050.bpc`.
- **Terrain Ray-Marching**: Precomputed 360° horizon elevation profiles at 1° azimuth resolution for both 2.0 m and 10.0 m observer heights using NASA’s `LDEM_75S_240M` polar digital elevation model, accounting for local spherical Moon curvature ($R = 1737.4\text{ km}$) out to 120 km radius.
- **Compact Typed Binary Packing**: Scaled and packed 87,648 epochs of solar and Earth azimuth/elevation into quantized Uint16/Int16 binary files (exactly 684 KB per site). The entire multi-year dataset for all 6 sites ships in under 4.5 MB.
- **Web Interface (`web/`)**: Engineered in React 18, Vite, TypeScript, and Tailwind CSS. Built with HTML5 Canvas timeline ribbons, SVG panoramic horizon graphics, and Vitest-backed metrics calculation.
- **Zero Backend, Zero Database**: Pure static deployment capable of running instantly on GitHub Pages or Vercel.

---

## 4. Space Agency & Open Data Resources
- **NASA NAIF SPICE System**: Ephemeris kernels `de440s.bsp`, leap seconds `naif0012.tls`, PCK constants `pck00010.tpc`, lunar frame kernel `moon_080317.tf`, and binary PCK `moon_pa_de421_1900-2050.bpc` ([NAIF Data Server](https://naif.jpl.nasa.gov/pub/naif/generic_kernels/)).
- **NASA Lunar Reconnaissance Orbiter (LRO) LOLA**: South polar digital elevation model `LDEM_75S_240M.IMG` and label `LDEM_75S_240M.LBL` via the [NASA Planetary Data System (PDS) Geosciences Node](https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/).
- **NASA Artemis III Candidate Landing Regions**: Coordinates and regional boundary definitions sourced from NASA Release 22-088 (August 2022) and verified against the Lunar Resources Registry and LPI/USRA cartographic databases.
- **Scientific Literature Benchmarks**:
  - Mazarico, E. et al. (2011), *Illumination conditions of the lunar polar regions using LOLA topography*, Icarus 211, 1066–1081.
  - Gläser, P. et al. (2014), *Illumination conditions at the lunar south pole using high resolution LOLA DEMs*, Icarus 243, 78–90.

---

## 5. Project Links & Artifacts
- **Live Interactive Demo**: [https://lunasite.spaceapps2026.app](https://lunasite.spaceapps2026.app) *(Static GitHub Pages / Vercel deployment)*
- **Open-Source GitHub Repository**: `https://github.com/nasa-spaceapps-2026/lunasite`
- **Scientific Validation Report**: Included in repository as [`docs/VALIDATION.md`](file:///c:/Users/Nishtha%20patel/OneDrive/lunapro/docs/VALIDATION.md)
- **Mathematical Methodology**: Included in repository as [`docs/METHODOLOGY.md`](file:///c:/Users/Nishtha%20patel/OneDrive/lunapro/docs/METHODOLOGY.md)
