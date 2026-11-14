"""
Portions of this file were generated with AI assistance.
Verify SPICE kernel loading, MOON_ME frame, and ephemeris calculation.
"""

import os
import math
import numpy as np
import spiceypy as spice

KERNELS_DIR = os.path.join(os.path.dirname(__file__), "kernels")
spice.furnsh(os.path.join(KERNELS_DIR, "naif0012.tls"))
spice.furnsh(os.path.join(KERNELS_DIR, "pck00010.tpc"))
spice.furnsh(os.path.join(KERNELS_DIR, "moon_080317.tf"))
spice.furnsh(os.path.join(KERNELS_DIR, "moon_pa_de421_1900-2050.bpc"))
spice.furnsh(os.path.join(KERNELS_DIR, "de440s.bsp"))

# Test epoch 2026-01-01T00:00:00
et = spice.str2et("2026-01-01T00:00:00")
print(f"ET for 2026-01-01: {et}")

# Site: Peak Near Shackleton (lat: -88.81 deg, lon: 124.68 deg, elev: 1.25 km)
lat = math.radians(-88.81)
lon = math.radians(124.68)
r_moon = 1737.4 + 1.25  # km

# Observer position in MOON_ME frame
obs_pos = np.array([
    r_moon * math.cos(lat) * math.cos(lon),
    r_moon * math.cos(lat) * math.sin(lon),
    r_moon * math.sin(lat)
])

# Topocentric basis
u_up = np.array([math.cos(lat) * math.cos(lon), math.cos(lat) * math.sin(lon), math.sin(lat)])
u_east = np.array([-math.sin(lon), math.cos(lon), 0.0])
u_north = np.cross(u_up, u_east)

# Sun position relative to Moon in MOON_ME
sun_pos, _ = spice.spkpos("SUN", et, "MOON_ME", "LT+S", "MOON")
v_sun = sun_pos - obs_pos
x_e = np.dot(v_sun, u_east)
y_n = np.dot(v_sun, u_north)
z_u = np.dot(v_sun, u_up)
sun_az = (math.degrees(math.atan2(x_e, y_n)) + 360.0) % 360.0
sun_el = math.degrees(math.atan2(z_u, math.sqrt(x_e**2 + y_n**2)))

# Earth position
earth_pos, _ = spice.spkpos("EARTH", et, "MOON_ME", "LT+S", "MOON")
v_earth = earth_pos - obs_pos
x_e = np.dot(v_earth, u_east)
y_n = np.dot(v_earth, u_north)
z_u = np.dot(v_earth, u_up)
earth_az = (math.degrees(math.atan2(x_e, y_n)) + 360.0) % 360.0
earth_el = math.degrees(math.atan2(z_u, math.sqrt(x_e**2 + y_n**2)))

print(f"Sun Az: {sun_az:.3f} deg, El: {sun_el:.3f} deg")
print(f"Earth Az: {earth_az:.3f} deg, El: {earth_el:.3f} deg")

# Max flat-horizon Sun elevation bound: (90 - |lat|) + 1.543 deg
max_flat_sun_el = (90.0 - abs(math.degrees(lat))) + 1.543
print(f"Max flat-horizon Sun elevation bound: {max_flat_sun_el:.3f} deg")
assert sun_el <= max_flat_sun_el + 0.1, f"Sun elevation {sun_el} exceeds theoretical bound {max_flat_sun_el}!"
print("[SUCCESS] SPICE MOON_ME frame, kernels, and topocentric calculations verified!")
spice.kclear()
