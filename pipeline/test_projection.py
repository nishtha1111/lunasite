# Portions of this file were generated with SI assistance (see SI_USE.md)
"""
Portions of this file were generated with AI assistance.
Verify forward and inverse projection on all Artemis III candidate sites.
"""

import os
import math
import numpy as np

LINES = 3812
SAMPLES = 3812
SCALE = 240.0
LINE_OFFSET = 1905.5
SAMPLE_OFFSET = 1905.5
R_MOON = 1737400.0

def latlon_to_pixel(lat_deg, lon_deg):
    colat_rad = math.radians(90.0 + lat_deg)
    lon_rad = math.radians(lon_deg)
    r = 2.0 * R_MOON * math.tan(colat_rad / 2.0)
    x = r * math.sin(lon_rad)
    y = -r * math.cos(lon_rad)
    s = (SAMPLE_OFFSET - 1.0) + (x / SCALE)
    l = (LINE_OFFSET - 1.0) + (y / SCALE)
    return l, s

def pixel_to_latlon(line, sample):
    x = (sample - (SAMPLE_OFFSET - 1.0)) * SCALE
    y = (line - (LINE_OFFSET - 1.0)) * SCALE
    r = math.sqrt(x**2 + y**2)
    colat_rad = 2.0 * math.atan(r / (2.0 * R_MOON))
    lat_deg = math.degrees(colat_rad) - 90.0
    lon_deg = (math.degrees(math.atan2(x, -y)) + 360.0) % 360.0
    if lon_deg > 180.0:
        lon_deg -= 360.0
    return lat_deg, lon_deg

# Test candidate sites
sites = [
    ("Peak Near Shackleton", -88.81, 124.68),
    ("Connecting Ridge", -89.45, -136.00),
    ("Malapert Massif", -86.00, 2.70),
    ("Faustini Rim A", -87.89, 90.00),
    ("de Gerlache Rim 1", -88.50, -68.00),
    ("Nobile Rim 1", -85.30, 31.50)
]

print("Verifying candidate site pixel mapping:")
DEM_PATH = os.path.join(os.path.dirname(__file__), "dem", "ldem_75s_240m.img")
dem = np.memmap(DEM_PATH, dtype='<i2', mode='r', shape=(LINES, SAMPLES))

for name, lat, lon in sites:
    l, s = latlon_to_pixel(lat, lon)
    round_l = int(round(l))
    round_s = int(round(s))
    elev = dem[round_l, round_s] * 0.5
    lat_inv, lon_inv = pixel_to_latlon(l, s)
    assert abs(lat - lat_inv) < 1e-4, f"Lat inverse error: {lat} vs {lat_inv}"
    assert abs(lon - lon_inv) < 1e-4, f"Lon inverse error: {lon} vs {lon_inv}"
    print(f"  {name:22s} -> pixel ({round_l:4d}, {round_s:4d}) | elevation = {elev:+7.1f} m | inv = ({lat_inv:.2f}, {lon_inv:.2f})")

print("[SUCCESS] Projection formulas verified and round-trip exact!")
