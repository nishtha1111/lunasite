"""
Portions of this file were generated with AI assistance.
LunaSite Topographic Horizon Ray-Marcher.
Precomputes 360-degree azimuthal terrain horizon elevation profiles (1 deg bins)
from NASA LRO LOLA Polar Digital Elevation Model (LDEM_75S_240M.IMG),
incorporating lunar spherical curvature and observer height parameters (2m sensor, 10m mast).
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
R_MOON = 1737400.0  # meters

class LolaHorizonRayMarcher:
    def __init__(self, dem_path=DEM_PATH):
        if not os.path.exists(dem_path):
            raise FileNotFoundError(f"LOLA DEM not found: {dem_path}")
        self.dem = np.memmap(dem_path, dtype='<i2', mode='r', shape=(LINES, SAMPLES))
        print("LolaHorizonRayMarcher initialized with LDEM_75S_240M.")

    def latlon_to_pixel(self, lat_deg, lon_deg):
        colat_rad = math.radians(90.0 + lat_deg)
        lon_rad = math.radians(lon_deg)
        r = 2.0 * R_MOON * math.tan(colat_rad / 2.0)
        x = r * math.sin(lon_rad)
        y = -r * math.cos(lon_rad)
        s = (SAMPLE_OFFSET - 1.0) + (x / SCALE)
        l = (LINE_OFFSET - 1.0) + (y / SCALE)
        return l, s

    def get_elevation_bilinear(self, l, s):
        """Bilinear interpolation of terrain elevation in meters."""
        if l < 0 or l >= LINES - 1 or s < 0 or s >= SAMPLES - 1:
            return 0.0  # default datum outside polar crop
        l0 = int(math.floor(l))
        l1 = l0 + 1
        s0 = int(math.floor(s))
        s1 = s0 + 1

        dl = l - l0
        ds = s - s0

        v00 = float(self.dem[l0, s0]) * 0.5
        v01 = float(self.dem[l0, s1]) * 0.5
        v10 = float(self.dem[l1, s0]) * 0.5
        v11 = float(self.dem[l1, s1]) * 0.5

        top = v00 * (1.0 - ds) + v01 * ds
        bottom = v10 * (1.0 - ds) + v11 * ds
        return top * (1.0 - dl) + bottom * dl

    def compute_horizon_profile(self, lat_deg, lon_deg, observer_height_m=2.0, max_dist_km=100.0):
        """
        Ray-marches outward in 360 azimuth bins (0 to 359 deg, 0=North, 90=East)
        computing the maximum terrain elevation angle (in degrees) relative to observer.
        """
        l_obs, s_obs = self.latlon_to_pixel(lat_deg, lon_deg)
        ground_elev = self.get_elevation_bilinear(l_obs, s_obs)
        r_obs = R_MOON + ground_elev + observer_height_m

        lat0_rad = math.radians(lat_deg)
        lon0_rad = math.radians(lon_deg)

        # Observer 3D position vector in Moon body-fixed frame
        P_obs = np.array([
            r_obs * math.cos(lat0_rad) * math.cos(lon0_rad),
            r_obs * math.cos(lat0_rad) * math.sin(lon0_rad),
            r_obs * math.sin(lat0_rad)
        ])

        # Local topocentric Up unit vector
        u_up = np.array([
            math.cos(lat0_rad) * math.cos(lon0_rad),
            math.cos(lat0_rad) * math.sin(lon0_rad),
            math.sin(lat0_rad)
        ])

        # Radial stepping: dense nearby, coarser at horizon edge (up to 100 km)
        d_steps = np.concatenate([
            np.arange(240, 10000, 240),    # 240m to 10km (step 240m)
            np.arange(10000, 30000, 480),  # 10km to 30km (step 480m)
            np.arange(30000, int(max_dist_km * 1000) + 1, 1000) # 30km to 100km (step 1000m)
        ])
        num_dist = len(d_steps)
        delta_arr = d_steps / R_MOON
        sin_delta = np.sin(delta_arr)
        cos_delta = np.cos(delta_arr)

        horizon_profile = np.zeros(360, dtype=np.float32)

        sin_lat0 = math.sin(lat0_rad)
        cos_lat0 = math.cos(lat0_rad)

        for az_deg in range(360):
            az_rad = math.radians(az_deg)
            sin_az = math.sin(az_rad)
            cos_az = math.cos(az_rad)

            # Spherical trigonometry to compute lat_d and lon_d along geodesic
            sin_lat_d = sin_lat0 * cos_delta + cos_lat0 * sin_delta * cos_az
            lat_d_arr = np.arcsin(np.clip(sin_lat_d, -1.0, 1.0))

            y_term = sin_az * sin_delta * cos_lat0
            x_term = cos_delta - sin_lat0 * sin_lat_d
            delta_lon_arr = np.arctan2(y_term, x_term)
            lon_d_arr = lon0_rad + delta_lon_arr

            # Vectorized pixel conversion
            colat_arr = (np.pi / 2.0) + lat_d_arr
            r_proj = 2.0 * R_MOON * np.tan(colat_arr / 2.0)
            x_proj = r_proj * np.sin(lon_d_arr)
            y_proj = -r_proj * np.cos(lon_d_arr)
            s_arr = (SAMPLE_OFFSET - 1.0) + (x_proj / SCALE)
            l_arr = (LINE_OFFSET - 1.0) + (y_proj / SCALE)

            # Sample terrain elevation
            valid_mask = (l_arr >= 0) & (l_arr < LINES - 1) & (s_arr >= 0) & (s_arr < SAMPLES - 1)
            valid_l = l_arr[valid_mask]
            valid_s = s_arr[valid_mask]
            valid_lat_d = lat_d_arr[valid_mask]
            valid_lon_d = lon_d_arr[valid_mask]

            # Fast integer sampling (nearest pixel for 240m grid is exact to 0.05 deg at distance)
            l_int = np.clip(np.round(valid_l).astype(int), 0, LINES - 1)
            s_int = np.clip(np.round(valid_s).astype(int), 0, SAMPLES - 1)
            h_terrain = self.dem[l_int, s_int].astype(np.float64) * 0.5

            r_terrain = R_MOON + h_terrain
            P_terrain = np.stack([
                r_terrain * np.cos(valid_lat_d) * np.cos(valid_lon_d),
                r_terrain * np.cos(valid_lat_d) * np.sin(valid_lon_d),
                r_terrain * np.sin(valid_lat_d)
            ], axis=-1)

            # Vector from observer to terrain point
            V = P_terrain - P_obs
            V_norm = np.linalg.norm(V, axis=-1)
            V_up = np.dot(V, u_up)

            # Topocentric elevation angle in degrees
            sin_elev = np.clip(V_up / V_norm, -1.0, 1.0)
            elev_deg = np.degrees(np.arcsin(sin_elev))

            max_el = float(np.max(elev_deg))
            horizon_profile[az_deg] = round(max_el, 2)

        return horizon_profile, ground_elev

def main():
    rm = LolaHorizonRayMarcher()
    # Test on Peak Near Shackleton
    print("Testing ray-marching on Peak Near Shackleton (-88.81S, 124.68E):")
    h2m, elev = rm.compute_horizon_profile(-88.81, 124.68, observer_height_m=2.0)
    h10m, _ = rm.compute_horizon_profile(-88.81, 124.68, observer_height_m=10.0)
    print(f"  Ground elevation: {elev:.1f} m")
    print(f"  2m Horizon angle range: [{np.min(h2m):.2f}°, {np.max(h2m):.2f}°], Mean: {np.mean(h2m):.2f}°")
    print(f"  10m Horizon angle range: [{np.min(h10m):.2f}°, {np.max(h10m):.2f}°], Mean: {np.mean(h10m):.2f}°")
    print(f"  Mast benefit (10m vs 2m horizon drop): Mean drop of {np.mean(h2m - h10m):.2f}°")

if __name__ == "__main__":
    main()
