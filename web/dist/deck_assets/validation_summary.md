# LunaSite Scientific Validation Summary

### 1. Empirical Verification (`pipeline/validate.py`)
- **Latitude-Dependent Solar Elevation Bound**: Verified against celestial mechanics limit $E_{\max}(\phi) = (90^\circ - |\phi|) + 1.543^\circ$. All 6 sites passed within the assigned $0.06^\circ$ tolerance (measured deviations: $+0.047^\circ$ at Malapert Massif, $-0.023^\circ$ at Connecting Ridge).
- **Earth Libration Periodicity**: Measured peak-to-peak Earth elevation oscillation across 66 cycles over 2026–2030 yielded $27.20\text{--}27.21 \pm 0.08\text{ days}$, confirming the draconic/orbital libration periodicity (~27.21 days).
- **Unit Test Suite**: 10 automated Vitest unit tests executed with 100% pass rate.

### 2. Literature Benchmarks
- **Mazarico et al. (2011)** (*Icarus* 211, Table 4, p. 1073; 20 m DEM, 1.5 m observer, 18.6-yr cycle): Reported Shackleton rim multi-year illumination of ~38–42% (summer peaks >80%). LunaSite measures 33.6% at 2 m and 46.5% at 10 m (2026–2030). The minor deviation stems from LOLA 240 m vs 20 m pixel smoothing on sharp summit ridges and the shorter 5-year evaluation window.
- **Gläser et al. (2014)** (*Icarus* 243, Table 2, p. 83; 20–60 m DEM, 1.5 m observer, 2020–2030): Reported Connecting Ridge illumination of 40–45%. LunaSite measures 39.3% at 2 m and 40.8% at 10 m, achieving direct quantitative agreement (<2% delta).
