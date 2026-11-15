# LunaSite – Super Intelligence (SI) & AI Usage Disclosure
**NASA Space Apps Challenge 2026**  
*Project: LunaSite | Challenge Track: Visualizing Sun & Earth Positions at the Lunar South Pole*

---

## 1. Ethical Disclosure Statement
In accordance with the official rules and ethical guidelines of the **NASA Space Apps Challenge 2026**, this document transparently discloses the use of Super Intelligence (SI) and Artificial Intelligence (AI) assistance in the design, development, documentation, and testing of **LunaSite**.

All scientific data ingested into LunaSite—including NASA NAIF SPICE planetary ephemerides and NASA LRO LOLA digital elevation models—was acquired directly from official NASA and PDS Geosciences repositories without artificial synthesis, hallucination, or fabrication. SI tools were utilized strictly as software engineering and scientific computing accelerators under direct human domain oversight and rigorous verification.

---

## 2. SI Tools & Models Utilized
- **Environment**: Google DeepMind Antigravity Advanced Agentic Coding environment.
- **Foundational Models**: Gemini 2.5 Pro and Gemini 2.5 Flash.
- **Operational Role**: Pair-programming accelerator, code boilerplate scaffolding, UI component implementation, documentation formatting, and automated test generation.

---

## 3. Scope of SI Involvement vs. Human Domain Oversight

### A. Mathematical Implementation & Astrodynamics Pipeline
- **SI Task**: Scaffolding Python scripts for parsing binary NAIF SPICE kernels (`spiceypy`), implementing topocentric coordinate transformations in the lunar mean Earth (`MOON_ME`) reference frame, polar stereographic map projection routines, and digital elevation model ray-marching.
- **Human Domain Oversight & Verification**:
  - All mathematical formulations for topocentric coordinate transformations, observer mast elevation corrections, and spherical Moon curvature corrections ($R = 1737.4\text{ km}$) were derived, reviewed, and checked by human engineers.
  - An independent automated validation suite (`pipeline/validate.py`) was formulated to mathematically verify that topocentric solar elevations never exceed theoretical celestial mechanics limits derived from lunar obliquity:
    $$E_{\text{sun,max}} \le (90^\circ - |\phi|) + 1.543^\circ$$
  - Earth libration oscillations were verified against analytical sidereal periods (~27.32 days across 66 cycles).
  - All outputs were tested against physical limits; no generated values were accepted without verification.

### B. Frontend Engineering & User Interface
- **SI Task**: Writing React 18, TypeScript, and Tailwind CSS components, including the canvas-based multi-site timeline ribbons (`TimelineRibbon.tsx`), the 360° panoramic horizon canvas (`HorizonView.tsx`), the sliding Best-Window Finder (`BestWindowFinder.tsx`), and the educational walkthrough carousel (`LearnView.tsx`).
- **Human Domain Oversight & Verification**:
  - UI/UX layout and interactions were designed to satisfy NASA Space Apps accessibility standards (WCAG AA contrast, colorblind-safe palettes, responsive layouts down to 360 px width).
  - TypeScript strict mode was enforced; zero compilation warnings or errors were permitted.
  - Automated headless browser tests validated layout, responsiveness, and performance across simulated mobile (390x844) and desktop (1600x1000) viewports.

### C. Scientific Ground-Truth Validation & Literature Comparison
- **SI Task**: Automating extraction and tabular formatting of benchmark comparisons between LunaSite outputs and peer-reviewed literature (*Mazarico et al. 2011*, *Gläser et al. 2014*).
- **Human Domain Oversight & Verification**:
  - Complete scientific honesty was enforced: all metrics reported in `docs/VALIDATION.md` and `submission/deck_assets/final_metrics.json` represent true computed values from raw LOLA DEM and SPICE data. No figures were synthesized or altered.
  - Discrepancies arising from DEM resolution differences (240 m vs 20 m) and exact ridge crest coordinate selections were explicitly documented and disclosed.

---

## 4. Visual Media & Imagery Disclosure
- **Screenshots & Graphics**: All UI screenshots included in the demonstration assets (`submission/deck_assets/*.png` and `submission/screenshots/*.png`) are 100% deterministic browser renders of running code, captured via automated Chromium browser automation at high resolution (device pixel ratio 2).
- **Zero Generative Image Models**: No generative AI image tools (e.g., Midjourney, DALL-E, Stable Diffusion, Imagen) were used to fabricate lunar landscapes, sky backgrounds, or simulated mission telemetry.
- **No NASA Logo Modification**: No official NASA insignia, meatballs, worms, mission patches, or space agency logos were altered, synthesized, or incorporated.

---

## 5. Verification Protocol & Code Quality Gates
To ensure code, data, and scientific integrity:
1. **Automated Unit Testing**: Automated unit tests (`web/src/tests/metrics.test.ts`) executed via Vitest to verify partial solar disc geometry, continuous darkness run algorithms, DWE visibility filters, and explainable score mathematics.
2. **Ephemeris Bounds Assertion**: 100% of the 87,648 computed epochs for each candidate site were passed through analytical boundary checks in Python before binary packaging.
3. **Headless Visual Regression**: Automated headless browser tests at multiple resolutions (1600x1000 desktop, 390x844 mobile) confirmed visual rendering fidelity and responsive compliance.

---

## 6. Provenance & Public Repository
For full transparency, the complete source code, offline pipeline scripts, and scientific validation derivations are publicly available at:  
`https://github.com/nishtha1111/lunasite`
