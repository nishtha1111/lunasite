"""
Portions of this file were generated with AI assistance.
Find Shackleton crater floor and verify exact PDS polar stereographic orientation.
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

dem = np.memmap(DEM_PATH, dtype='<i2', mode='r', shape=(LINES, SAMPLES))

# Shackleton is within 50 pixels (12 km) of South Pole
pole_l = int(round(LINE_OFFSET - 1))
pole_s = int(round(SAMPLE_OFFSET - 1))

# Extract 100x100 crop around south pole
crop = dem[pole_l - 60 : pole_l + 60, pole_s - 60 : pole_s + 60] * 0.5
min_idx = np.unravel_index(np.argmin(crop), crop.shape)
min_l = (pole_l - 60) + min_idx[0]
min_s = (pole_s - 60) + min_idx[1]
print(f"Deepest point near South Pole (Shackleton floor):")
print(f"  Pixel line={min_l}, sample={min_s}")
print(f"  Elevation={crop[min_idx]:.1f} meters")
print(f"  Offset from pole pixel ({pole_l}, {pole_s}): dl={min_l - pole_l}, ds={min_s - pole_s}")

# Check distance from pole in meters
dx_pix = min_s - (SAMPLE_OFFSET - 1)
dy_pix = (LINE_OFFSET - 1) - min_l # standard cartesian y
dist_m = math.sqrt(dx_pix**2 + dy_pix**2) * SCALE
print(f"  Distance from South Pole: {dist_m:.1f} meters ({dist_m/1000.0:.2f} km)")
# Polar angle of Shackleton center (89.9 S -> 0.1 deg = 0.1/180 * pi * 1737.4 km = 3.03 km)
# Let's check azimuth from pole
az_rad = math.atan2(dx_pix, dy_pix)
az_deg = (math.degrees(az_rad) + 360.0) % 360.0
print(f"  Azimuth direction from pole in grid: {az_deg:.1f} deg")
