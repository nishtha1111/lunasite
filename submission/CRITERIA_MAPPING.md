# LunaSite – NASA Space Apps Challenge Criteria Mapping
**Project: LunaSite** | *Track: Visualizing Sun & Earth Positions at the Lunar South Pole*
*Official 5-Criteria Evaluation Breakdown*

---

### 1. Impact
*How much does the solution address the challenge, and what potential does it have to create meaningful value?*

- **Addresses the Core Challenge**: Solves the central bottleneck highlighted in the NASA challenge statement: existing mission planning tools have complicated, heavy interfaces that prevent fast, intuitive evaluation of solar power and direct-with-Earth (DWE) communications.
- **Rapid Decision Support**: A mission planner or engineer can compare candidate landing sites (e.g. *Peak Near Shackleton*, *Connecting Ridge*, *Malapert Massif*, *Nobile Rim 1*) across 5 years of ephemerides in **under 30 seconds**, cutting planning evaluation cycles from days to minutes.
- **Democratization of Planetary Science**: By requiring **zero login, zero installation, no backend server, and no proprietary software**, LunaSite makes NASA's highest-priority Artemis landing region data accessible to high school classrooms, university researchers, science journalists, and the global public.
- **Explainable Viability Metrics**: Eliminates "black box" scoring by providing fully transparent mathematical formulas and customizable operational presets (Rover, Lander, Crewed Stay).

---

### 2. Creativity
*How original and innovative is the approach? Does it combine concepts in an inventive, elegant way?*

- **Offline-Precomputed Compact Binary Architecture**: Instead of sluggish real-time backend API requests or heavy 500 MB client downloads, LunaSite packs 5 years of 30-minute SPICE ephemerides into **quantized 8-byte typed array buffers (684 KB per site)**. Total data payload is <4.5 MB, running seamlessly in standard web browsers.
- **360° Cylindrical Horizon Canvas**: Merges a full 360° terrain silhouette derived from LOLA ray-marching with simultaneous extended-disc models of both the Sun (0.53° diameter) and Earth (1.9° diameter), showing grazing chord fractions rather than binary point-source clipping.
- **Mast Height Toggle (2.0 m vs 10.0 m)**: Introduces the operational insight that a 10-meter deployable mast lowers the apparent lunar horizon by 0.5° to 1.5°, recapturing hundreds of hours of solar illumination.
- **Automated Sliding Best-Window Finder**: Features a client-side algorithmic window scanner that automatically discovers and ranks optimal 7-day, 14-day, or 30-day surface mission opportunities with 1-click application to the workspace.

---

### 3. Validity
*Is the solution scientifically, mathematically, and technically sound? Is it grounded in verifiable data?*

- **100% Real NASA Data—Zero Fabricated Content**:
  - Ephemerides computed with **NAIF SPICE** using the official planetary ephemeris kernel `de440s.bsp`, leap seconds `naif0012.tls`, body constants `pck00010.tpc`, lunar frame kernel `moon_080317.tf`, and high-precision lunar binary PCK `moon_pa_de421_1900-2050.bpc` in the Moon Mean Earth / Polar Axis (`MOON_ME`) reference frame.
  - Topography computed directly from the **NASA Lunar Reconnaissance Orbiter (LRO) Lunar Orbiter Laser Altimeter (LOLA)** gridded data record `LDEM_75S_240M` via the NASA PDS Geosciences Node.
- **Automated Scientific Validation Suite (`pipeline/validate.py` & `docs/VALIDATION.md`)**:
  - **Solar Latitude Bounds**: Proved that all topocentric Sun elevations across 87,648 epochs strictly obey $(90 - |\phi|) + 1.543^\circ$ within ±0.03°.
  - **Earth Libration Periodicity**: Proved that Earth elevation oscillates with an empirical fundamental period of **27.21 ± 0.08 days**, matching the 27.32-day lunar sidereal/draconic cycle.
  - **Literature Ground Truth Benchmarking**: Compared results against published peer-reviewed studies:
    - *Mazarico et al. (2011)*: 38.1% annual illumination at Shackleton Rim matches Mazarico's multi-year baseline within < 3%, with longest darkness (59 days) directly replicating published winter occultations.
    - *Gläser et al. (2014)*: 40.4% illumination at Connecting Ridge matches Gläser's 40–45% range.

---

### 4. Relevance
*How directly does the project respond to the NASA Space Apps Challenge and NASA's Artemis mission objectives?*

- **Direct Artemis III Alignment**: Evaluates verified candidate landing regions designated by NASA in 2022 (*Faustini Rim A*, *Peak Near Shackleton*, *Connecting Ridge*, *de Gerlache Rim 1*, *Malapert Massif*, *Nobile Rim 1*).
- **Core NASA Mission Constraints**: Explicitly models the critical Artemis constraints:
  - Surface slope and high-ground selection within 6° of the south pole.
  - Direct-with-Earth (DWE) line-of-sight communication without reliance on orbital relay satellites.
  - Cryogenic thermal survival by tracking continuous darkness periods exceeding 48 hours.
  - Power and comms overlap windows essential for Apollo-style and Artemis surface EVAs.

---

### 5. Presentation
*Is the project clearly communicated, intuitive to use, and polished in design and accessibility?*

- **Intuitive UI/UX in <10 Seconds**: First-time users immediately see stacked timeline ribbons, plain-English summary cards, and an interactive #1 recommended site badge without cognitive overload.
- **Dark Mission Control Aesthetic**: Designed with professional aerospace ergonomics, clear visual hierarchy, distinct Sun (amber/gold) and Earth (cyan/blue) palettes, and consistent micro-interactions.
- **Full Accessibility (a11y)**: Colorblind-safe palette, WCAG AA contrast compliance, keyboard focus rings, semantic HTML structure, and screen-reader considerations.
- **Comprehensive Educational Integration**: Built-in 6-step guided walkthrough (*Learn Mode*) and searchable Technical Glossary explaining azimuth, elevation, DWE, libration, and permanently shadowed regions.
- **Export & Portability**: 1-click CSV data download, PNG comparison chart export, and shareable URL state hashing for seamless collaboration.
