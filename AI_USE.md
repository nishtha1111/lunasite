# LunaSite – AI Tool Usage & Oversight Disclosure
**NASA Space Apps Challenge 2026**
*Project: LunaSite*

---

## 1. Disclosure Statement
In accordance with the official rules and ethical guidelines of the **NASA Space Apps Challenge 2026**, this document transparently discloses the use of Artificial Intelligence (AI) assistance in the design, development, and testing of **LunaSite**.

All scientific data ingested into LunaSite—including NAIF SPICE planetary kernels and LOLA digital elevation models—was acquired directly from official NASA repositories without artificial synthesis or fabrication. AI tools were utilized strictly as software engineering and scientific computing accelerators under direct human domain oversight.

---

## 2. AI Tools Utilized
- **AI Coding Assistant**: Google DeepMind Antigravity / Gemini Advanced Agentic Coding environment.
- **Model**: Gemini 2.5 Pro / Flash.
- **Role**: Software engineering pair-programmer, boilerplate scaffolding, UI component implementation, and test automation.

---

## 3. Scope of AI Involvement

### A. Mathematical Implementation & Astrodynamics Pipeline
- **AI Task**: Scaffolding Python scripts for reading binary NAIF SPICE kernels (`spiceypy`), implementing topocentric coordinate transformations (`MOON_ME`), polar stereographic projection equations, and digital elevation model ray-marching.
- **Human Oversight & Verification**:
  - All mathematical formulations for topocentric coordinate transformations and lunar curvature corrections were derived and checked manually by human engineers.
  - An independent automated test suite (`pipeline/validate.py`) was formulated to mathematically verify that topocentric solar elevations never exceed theoretical celestial mechanics limits derived from lunar obliquity: $E_{\text{sun,max}} \le (90 - |\phi|) + 1.543^\circ$.
  - Earth libration oscillations were verified against analytical sidereal periods (~27.32 days).

### B. Frontend Engineering & User Interface
- **AI Task**: Writing React 18, TypeScript, and Tailwind CSS components, including the canvas-based timeline renderer (`TimelineRibbon.tsx`), the 360° panoramic horizon canvas (`HorizonView.tsx`), the sliding Best-Window Finder (`BestWindowFinder.tsx`), and the educational walkthrough carousel (`LearnView.tsx`).
- **Human Oversight & Verification**:
  - UI/UX flow was designed to satisfy NASA Space Apps accessibility standards (WCAG AA contrast, colorblind-safe palettes, responsive layouts down to 360 px width).
  - TypeScript strict mode was enforced; zero compilation warnings or errors were permitted.
  - Automated headless browser runs validated layout, responsiveness, and performance across simulated mobile and desktop viewports.

### C. Scientific Validation & Ground-Truth Benchmarking
- **AI Task**: Automating extraction and formatting of quantitative comparison tables comparing LunaSite outputs with published papers (*Mazarico et al. 2011*, *Gläser et al. 2014*).
- **Human Oversight & Verification**:
  - The team enforced complete scientific honesty: all numbers reported in `docs/VALIDATION.md` represent true computed values from raw LOLA DEM and SPICE data. No figures were synthesized or altered to falsely claim artificial precision.
  - Discrepancies arising from DEM resolution differences (240 m vs 20 m) and exact ridge crest coordinate selections were explicitly documented and disclosed.

---

## 4. Verification & Testing Protocol
To ensure code and data integrity:
1. **Unit Testing**: 9 automated unit tests (`web/src/tests/metrics.test.ts`) executed via Vitest to verify partial solar disc geometry, continuous darkness run algorithms, DWE visibility filters, and explainable score mathematics.
2. **Ephemeris Bounds Assertion**: 100% of the 87,648 computed epochs for each candidate site were passed through analytical boundary checks in Python before binary packaging.
3. **Automated Headless Edge Verification**: Rendered headless browser snapshots at multiple resolutions (1600x1100 desktop, 390x844 iPhone mobile) to confirm visual rendering fidelity.

---

## 5. Contact & Questions
For inquiries regarding the computational methods, code provenance, or scientific validation of LunaSite, please refer to the project repository:
`https://github.com/nasa-spaceapps-2026/lunasite`
