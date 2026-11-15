# Portions of this file were generated with SI assistance (see SI_USE.md)
"""
Portions of this file were generated with AI assistance.
Inspect LOLA South Polar DEM binary data and verify projection formulas.
"""

import os
import math
import numpy as np

DEM_PATH = os.path.join(os.path.dirname(__file__), "dem", "ldem_75s_240m.img")
LINES = 3812
SAMPLES = 3812
SCALE = 240.0
LINE_OFFSET = 1905.5
SAMPLE_OFFSET = 1905.5
R_MOON = 1737400.0

# Load DEM as memory-mapped 2D int16 array
dem = np.memmap(DEM_PATH, dtype='<i2', mode='r', shape=(LINES, SAMPLES))
print(f"DEM loaded: shape={dem.shape}, dtype={dem.dtype}")

# Sample min/max DN
dn_min = int(dem.min())
dn_max = int(dem.max())
print(f"DN range: [{dn_min}, {dn_max}]")
print(f"Elevation in meters: [{dn_min * 0.5:.1f} m, {dn_max * 0.5:.1f} m]")

# Test projection for South Pole (-90 deg, 0 deg)
# At pole, c = 0 -> line = 1905.5 - 1 = 1904.5 -> pixel ~1905
pole_line = int(round(LINE_OFFSET - 1))
pole_sample = int(round(SAMPLE_OFFSET - 1))
print(f"South Pole pixel: line={pole_line}, sample={pole_sample}, elevation={dem[pole_line, pole_sample] * 0.5:.1f} m")

# Function to project (lat, lon) to (sample, line)
def latlon_to_pixel(lat_deg, lon_deg):
    colat_rad = math.radians(90.0 + lat_deg)
    lon_rad = math.radians(lon_deg)
    r = 2.0 * R_MOON * math.tan(colat_rad / 2.0)
    x = r * math.sin(lon_rad)
    y = -r * math.cos(lon_rad) # PDS standard: 0 deg lon points down (sample offset, line offset + r/scale) or up
    s = SAMPLE_OFFSET - 1 + (x / SCALE)
    l1 = LINE_OFFSET - 1 - (y / SCALE) # if 0 lon is down, y < 0 -> l > offset
    l2 = LINE_OFFSET - 1 + (y / SCALE)
    return (s, l1, l2)

# Check Shackleton crater center (-89.9 S, 0.0 E)
s, l1, l2 = latlon_to_pixel(-89.9, 0.0)
print(f"Shackleton center: sample={s:.1f}, line1={l1:.1f} (elev={dem[int(l1), int(s)]*0.5:.1f}m), line2={l2:.1f} (elev={dem[int(l2), int(s)]*0.5:.1f}m)")

# Check Shackleton rim peak (-88.81 S, 124.68 E)
s_p, l1_p, l2_p = latlon_to_pixel(-88.81, 124.68)
print(f"Peak Near Shackleton: sample={s_p:.1f}, line1={l1_p:.1f} (elev={dem[int(l1_p), int(s_p)]*0.5:.1f}m)")
