# LunaSite Scientific Methodology & Mathematical Formulations
**NASA Space Apps Challenge 2026** | *Visualizing Sun & Earth Positions at the Lunar South Pole*
*Author: Team LunaSite*

---

## 1. Celestial Reference Frames & Ephemeris Computation

### 1.1 Body-Fixed Frame: `MOON_ME`
Planetary positions are computed using the NASA NAIF SPICE toolkit with planetary ephemeris kernel `de440s.bsp`. To determine positions relative to surface features, vectors are transformed from the International Celestial Reference Frame (ICRF) into the lunar body-fixed frame:
- **Frame**: `MOON_ME` (Moon Mean Earth / Polar Axis frame), specified by the frame kernel `moon_080317.tf` and high-precision binary PCK `moon_pa_de421_1900-2050.bpc`.
- In `MOON_ME`, the Z-axis aligns with the mean lunar rotation axis (pointing north), the X-axis points toward the mean sub-Earth point (prime meridian, 0° longitude), and the Y-axis completes the right-handed orthogonal system ($Y = Z \times X$).

### 1.2 Topocentric Coordinate Transformation
Let an observer on the lunar surface be defined by planetodetic coordinates:
- Latitude: $\phi \in [-90^\circ, 0^\circ]$
- Longitude: $\lambda \in [-180^\circ, +180^\circ]$
- Elevation above reference sphere: $h_{\text{elev}}$ (m)
- Sensor/Mast height above local terrain: $h_{\text{obs}} \in \{2.0\text{ m}, 10.0\text{ m}\}$

The radial distance from the Moon's center of mass is:
$$R_{\text{obs}} = R_{\text{moon}} + h_{\text{elev}} + h_{\text{obs}} \quad (R_{\text{moon}} = 1737400\text{ m})$$

The observer Cartesian position vector $\vec{r}_{\text{obs}}$ in the `MOON_ME` frame is:
$$\vec{r}_{\text{obs}} = \begin{pmatrix} R_{\text{obs}} \cos\phi \cos\lambda \\ R_{\text{obs}} \cos\phi \sin\lambda \\ R_{\text{obs}} \sin\phi \end{pmatrix}$$

The local topocentric East-North-Up (ENU) unit basis vectors are:
$$\hat{u} = \begin{pmatrix} \cos\phi \cos\lambda \\ \cos\phi \sin\lambda \\ \sin\phi \end{pmatrix}, \quad \hat{e} = \begin{pmatrix} -\sin\lambda \\ \cos\lambda \\ 0 \end{pmatrix}, \quad \hat{n} = \hat{u} \times \hat{e} = \begin{pmatrix} -\sin\phi \cos\lambda \\ -\sin\phi \sin\lambda \\ \cos\phi \end{pmatrix}$$

For a target body (Sun or Earth) with state vector $\vec{r}_{\text{target}}$ in `MOON_ME` (corrected for light-time and stellar aberration via `CN+S` in SPICE), the topocentric vector is:
$$\vec{\rho} = \vec{r}_{\text{target}} - \vec{r}_{\text{obs}}, \quad \rho = |\vec{\rho}|$$

The topocentric Azimuth $A \in [0^\circ, 360^\circ)$ and Elevation $E \in [-90^\circ, +90^\circ]$ are given by:
$$A = \text{atan2}(\vec{\rho} \cdot \hat{e}, \, \vec{\rho} \cdot \hat{n}) \pmod{360^\circ}$$
$$E = \arcsin\left(\frac{\vec{\rho} \cdot \hat{u}}{\rho}\right)$$

---

## 2. LOLA Digital Elevation Model & Ray-Marching Horizon

### 2.1 Polar Stereographic Projection
We utilize NASA's Lunar Orbiter Laser Altimeter (LOLA) south polar DEM `LDEM_75S_240M` ($3812 \times 3812$ pixels, 240 m/pixel resolution, scale center $-90^\circ\text{S}, 0^\circ\text{E}$).
Given a point at $(\phi, \lambda)$:
$$c = 90^\circ + \phi \quad (\text{colatitude in radians})$$
$$r = 2 R_{\text{moon}} \tan\left(\frac{c}{2}\right)$$
$$X = r \sin\lambda, \quad Y = -r \cos\lambda$$
$$\text{sample} = 1904.5 + \frac{X}{240.0}, \quad \text{line} = 1904.5 + \frac{Y}{240.0}$$

Elevation values $z(X, Y)$ are stored as 16-bit signed integers scaled by $0.5\text{ m/DN}$. Elevations at non-integer pixel coordinates are sampled using bilinear interpolation.

### 2.2 Topographic Ray-Marching with Spherical Curvature
For each azimuth bin $\alpha \in \{0^\circ, 1^\circ, \dots, 359^\circ\}$, we march a ray outwards from the observer up to a maximum radius $D_{\text{max}} = 120\text{ km}$ at step intervals $\Delta d = 240\text{ m}$.

At each radial distance $d$, the terrain elevation is $z(d, \alpha)$. Because the lunar surface curves away beneath the local horizontal plane, the drop due to spherical curvature over distance $d$ is:
$$\delta z_{\text{curv}}(d) \approx \frac{d^2}{2 R_{\text{moon}}}$$

The apparent elevation angle $\theta(d, \alpha)$ from the observer at height $z_{\text{obs}} = z(0) + h_{\text{obs}}$ is:
$$\theta(d, \alpha) = \arctan\left(\frac{z(d, \alpha) - z_{\text{obs}} - \frac{d^2}{2 R_{\text{moon}}}}{d}\right)$$

The local horizon profile elevation $H(\alpha)$ for azimuth $\alpha$ is the maximum angle encountered along the line of sight:
$$H(\alpha) = \max_{d \in (0, D_{\text{max}}]} \theta(d, \alpha)$$

Precomputing this for 360 bins yields a fast $O(1)$ lookup table for any azimuth in the client web application.

---

## 3. Extended Celestial Disc Models

Because the Sun and Earth appear as extended discs in the lunar sky rather than infinitesimal points, clipping at the center introduces discrete on/off step artifacts. LunaSite implements geometric chord-segment disc models:

### 3.1 Solar Disc Illumination Fraction ($D_{\odot} = 0.533^\circ$)
With angular radius $r_{\odot} = 0.2665^\circ$:
- Top limb: $E_{\text{top}} = E_{\odot} + r_{\odot}$
- Bottom limb: $E_{\text{bottom}} = E_{\odot} - r_{\odot}$

Let $H = H(\lfloor A_{\odot} \rfloor)$ be the local terrain horizon elevation at the Sun's azimuth.
- If $E_{\text{bottom}} \ge H$: Solar disc is fully unobstructed $\to f_{\text{sun}} = 1.0$.
- If $E_{\text{top}} \le H$: Solar disc is completely occulted $\to f_{\text{sun}} = 0.0$.
- Otherwise, the fractional visible span is:
  $$f_{\text{sun}} = \frac{E_{\text{top}} - H}{2 r_{\odot}} \in (0.0, 1.0)$$

Active solar power generation threshold is defined as $f_{\text{sun}} > 0.10$.

### 3.2 Earth Disc & Direct-with-Earth Line-of-Sight ($D_{\oplus} = 1.90^\circ$)
With angular radius $r_{\oplus} = 0.95^\circ$, direct RF communication link is active if any portion of the Earth disc clears the terrain horizon:
$$\text{DWE Active} \iff E_{\oplus} + r_{\oplus} > H(\lfloor A_{\oplus} \rfloor)$$

---

## 4. Mission Viability Scoring Formulation

To evaluate landing site suitability without black-box opacity, LunaSite computes an **explainable Mission Viability Score** $S \in [0, 100]$:

$$S = w_1 \cdot F_{\text{sun}} - w_2 \cdot P_{\text{dark}} + w_3 \cdot F_{\text{dwe}} - w_4 \cdot P_{\text{outage}}$$

Where:
- $F_{\text{sun}} \in [0, 100]$: Percentage of time the site receives solar illumination.
- $P_{\text{dark}} = \min\left(100, \, \frac{T_{\text{dark,max}}}{T_{\text{ref}}} \times 100\right)$: Penalty for continuous freezing darkness ($T_{\text{ref}} = 336\text{ h}$, or 14 Earth days).
- $F_{\text{dwe}} \in [0, 100]$: Percentage of time direct-with-Earth communication line of sight is active.
- $P_{\text{outage}} = \min\left(100, \, \frac{T_{\text{outage,max}}}{T_{\text{ref}}} \times 100\right)$: Penalty for longest continuous communications loss.
- Weights $w_i \ge 0$ satisfy $\sum_{i=1}^4 w_i = 100$.

### Operational Presets:
| Preset | $w_1$ (Sun) | $w_2$ (Dark Penalty) | $w_3$ (DWE) | $w_4$ (Outage Penalty) | Primary Architectural Focus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Rover Mission** | 40% | 35% | 15% | 10% | Thermal heating survival & solar battery charging |
| **Static Lander** | 30% | 20% | 30% | 20% | Balanced solar science & steady telemetry downlink |
| **Crewed Stay** | 25% | 25% | 30% | 20% | Reliable DWE comm links & crew EVA safety margins |
| **Education Mode** | 25% | 25% | 25% | 25% | Equal-weight balanced scoring for intuitive student learning |
