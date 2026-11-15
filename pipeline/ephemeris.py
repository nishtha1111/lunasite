# Portions of this file were generated with SI assistance (see SI_USE.md)
"""
Portions of this file were generated with AI assistance.
LunaSite Offline Ephemeris & Terrain Horizon Pipeline
Computes topocentric Sun and Earth azimuth and elevation at all candidate lunar south pole landing sites
using NAIF SPICE kernels (DE440s, MOON_ME frame, high-accuracy binary PCK),
and performs LOLA DEM ray-marching to extract 360-bin topographic horizon masking profiles.
"""

import os
import sys
import json
import math
import struct
import numpy as np
import spiceypy as spice

from horizon import LolaHorizonRayMarcher

# Output directory for client-side data
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "web", "public", "data"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load NAIF kernels
KERNELS_DIR = os.path.join(os.path.dirname(__file__), "kernels")
REQUIRED_KERNELS = [
    "naif0012.tls",
    "pck00010.tpc",
    "moon_080317.tf",
    "moon_pa_de421_1900-2050.bpc",
    "de440s.bsp",
]

for k in REQUIRED_KERNELS:
    path = os.path.join(KERNELS_DIR, k)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing required SPICE kernel: {path}. Run download_kernels.py first.")
    spice.furnsh(path)

# Date specifications (Dynamic epoch calculation)
START_UTC = "2026-01-01T00:00:00"
END_UTC = "2030-12-31T23:30:00"
STEP_SECONDS = 1800  # 30 minutes

start_et = spice.str2et(START_UTC)
end_et = spice.str2et(END_UTC)
num_steps = int(round((end_et - start_et) / STEP_SECONDS)) + 1
et_grid = start_et + np.arange(num_steps) * STEP_SECONDS

print(f"=== LunaSite Ephemeris & LOLA Horizon Pipeline ===")
print(f"Time Grid: {START_UTC} to {END_UTC}")
print(f"Step: {STEP_SECONDS}s (30m) -> Total Epochs: {num_steps}")

# Initialize Ray Marcher
ray_marcher = LolaHorizonRayMarcher()

# Load sites
SITES_PATH = os.path.join(os.path.dirname(__file__), "sites.json")
with open(SITES_PATH, "r", encoding="utf-8") as f:
    sites_meta = json.load(f)

# All 6 core MVP candidate regions
MVP_SITE_IDS = {
    "shackleton_peak",
    "connecting_ridge",
    "malapert_massif",
    "faustini_rim_a",
    "de_gerlache_rim_1",
    "nobile_rim_1"
}

R_MOON_KM = 1737.4

def compute_site_dataset(site):
    site_id = site["id"]
    lat_deg = site["lat_deg"]
    lon_deg = site["lon_deg"]

    print(f"\nProcessing Site: {site['name']} ({site_id}) [{lat_deg}°S, {lon_deg}°E]...")

    # 1. Precompute Topographic Horizon Profiles via LOLA DEM Ray-Marching
    print("  Ray-marching LOLA DEM for 2m and 10m horizon profiles...")
    h_2m, ground_elev_m = ray_marcher.compute_horizon_profile(lat_deg, lon_deg, observer_height_m=2.0)
    h_10m, _ = ray_marcher.compute_horizon_profile(lat_deg, lon_deg, observer_height_m=10.0)

    # 2. Ephemeris topocentric position in MOON_ME frame
    lat = math.radians(lat_deg)
    lon = math.radians(lon_deg)
    r = R_MOON_KM + (ground_elev_m / 1000.0)

    obs_pos = np.array([
        r * math.cos(lat) * math.cos(lon),
        r * math.cos(lat) * math.sin(lon),
        r * math.sin(lat)
    ])

    u_up = np.array([math.cos(lat) * math.cos(lon), math.cos(lat) * math.sin(lon), math.sin(lat)])
    u_east = np.array([-math.sin(lon), math.cos(lon), 0.0])
    u_north = np.cross(u_up, u_east)

    max_flat_sun_el = (90.0 - abs(lat_deg)) + 1.543

    sun_az = np.zeros(num_steps, dtype=np.float64)
    sun_el = np.zeros(num_steps, dtype=np.float64)
    earth_az = np.zeros(num_steps, dtype=np.float64)
    earth_el = np.zeros(num_steps, dtype=np.float64)

    for i in range(num_steps):
        t = et_grid[i]
        
        # Sun position
        sun_p, _ = spice.spkpos("SUN", t, "MOON_ME", "LT+S", "MOON")
        v_sun = sun_p - obs_pos
        se_e = v_sun[0]*u_east[0] + v_sun[1]*u_east[1] + v_sun[2]*u_east[2]
        se_n = v_sun[0]*u_north[0] + v_sun[1]*u_north[1] + v_sun[2]*u_north[2]
        se_u = v_sun[0]*u_up[0] + v_sun[1]*u_up[1] + v_sun[2]*u_up[2]
        sun_az[i] = (math.degrees(math.atan2(se_e, se_n)) + 360.0) % 360.0
        sun_el[i] = math.degrees(math.atan2(se_u, math.sqrt(se_e**2 + se_n**2)))

        # Earth position
        earth_p, _ = spice.spkpos("EARTH", t, "MOON_ME", "LT+S", "MOON")
        v_earth = earth_p - obs_pos
        ee_e = v_earth[0]*u_east[0] + v_earth[1]*u_east[1] + v_earth[2]*u_east[2]
        ee_n = v_earth[0]*u_north[0] + v_earth[1]*u_north[1] + v_earth[2]*u_north[2]
        ee_u = v_earth[0]*u_up[0] + v_earth[1]*u_up[1] + v_earth[2]*u_up[2]
        earth_az[i] = (math.degrees(math.atan2(ee_e, ee_n)) + 360.0) % 360.0
        earth_el[i] = math.degrees(math.atan2(ee_u, math.sqrt(ee_e**2 + ee_n**2)))

    # Verification against theoretical bounds
    actual_max_sun_el = float(np.max(sun_el))
    print(f"  Sun El: [{np.min(sun_el):.2f}°, {actual_max_sun_el:.2f}°] (Bound: <= {max_flat_sun_el:.2f}°)")
    print(f"  Earth El: [{np.min(earth_el):.2f}°, {np.max(earth_el):.2f}°]")
    print(f"  2m Horizon profile: [{np.min(h_2m):.2f}°, {np.max(h_2m):.2f}°], Mean = {np.mean(h_2m):.2f}°")
    print(f"  10m Horizon profile: [{np.min(h_10m):.2f}°, {np.max(h_10m):.2f}°], Mean = {np.mean(h_10m):.2f}°")

    # Quantize to binary (Uint16 Azimuth, Int16 Elevation)
    sun_az_u16 = np.mod(np.round(sun_az * 100.0), 36000).astype(np.uint16)
    sun_el_i16 = np.round(sun_el * 100.0).astype(np.int16)
    earth_az_u16 = np.mod(np.round(earth_az * 100.0), 36000).astype(np.uint16)
    earth_el_i16 = np.round(earth_el * 100.0).astype(np.int16)

    bin_path = os.path.join(OUTPUT_DIR, f"{site_id}.bin")
    with open(bin_path, "wb") as bf:
        for i in range(num_steps):
            bf.write(struct.pack("<HhHh", sun_az_u16[i], sun_el_i16[i], earth_az_u16[i], earth_el_i16[i]))

    bin_size = os.path.getsize(bin_path)
    print(f"  Exported binary: {bin_path} ({bin_size} bytes)")

    # Calculate Terrain-Masked Statistics (2m observer height)
    sun_bins = np.floor(sun_az).astype(int) % 360
    earth_bins = np.floor(earth_az).astype(int) % 360
    
    sun_horizons = h_2m[sun_bins]
    earth_horizons = h_2m[earth_bins]

    # Solar disc model (radius 0.265°)
    sun_vis = (sun_el + 0.265) > sun_horizons
    earth_vis = (earth_el + 0.95) > earth_horizons
    overlap_vis = sun_vis & earth_vis

    terrain_sunlit_pct = float(np.mean(sun_vis) * 100.0)
    terrain_earth_pct = float(np.mean(earth_vis) * 100.0)
    terrain_overlap_pct = float(np.mean(overlap_vis) * 100.0)

    # Flat horizon stats for comparison
    flat_sun_vis = sun_el > 0.0
    flat_earth_vis = earth_el > 0.0
    flat_sunlit_pct = float(np.mean(flat_sun_vis) * 100.0)
    flat_earth_pct = float(np.mean(flat_earth_vis) * 100.0)

    print(f"  Terrain Masking Effect: Sunlit {flat_sunlit_pct:.1f}% -> {terrain_sunlit_pct:.1f}% | Earth DWE {flat_earth_pct:.1f}% -> {terrain_earth_pct:.1f}%")

    meta = {
        "id": site_id,
        "name": site["name"],
        "region": site["region"],
        "lat_deg": lat_deg,
        "lon_deg": lon_deg,
        "elev_m": round(ground_elev_m, 1),
        "status": site.get("status", "approximate"),
        "description": site.get("description", ""),
        "start_utc": START_UTC,
        "end_utc": END_UTC,
        "step_seconds": STEP_SECONDS,
        "num_steps": num_steps,
        "bytes_per_step": 8,
        "format": "HhHh (sun_az_u16, sun_el_i16, earth_az_u16, earth_el_i16) scaled by 100",
        "binary_file": f"{site_id}.bin",
        "horizon_profile_default": [round(float(v), 2) for v in h_2m],
        "horizon_profile_mast": [round(float(v), 2) for v in h_10m],
        "max_flat_sun_elevation_bound": round(max_flat_sun_el, 3),
        "actual_max_sun_elevation": round(actual_max_sun_el, 3),
        "stats": {
            "flat_sunlit_pct": round(flat_sunlit_pct, 2),
            "flat_earth_pct": round(flat_earth_pct, 2),
            "terrain_sunlit_pct": round(terrain_sunlit_pct, 2),
            "terrain_earth_pct": round(terrain_earth_pct, 2),
            "terrain_overlap_pct": round(terrain_overlap_pct, 2)
        },
        "ai_use": "Generated with AI assistance under human scientific oversight."
    }

    meta_path = os.path.join(OUTPUT_DIR, f"{site_id}.json")
    with open(meta_path, "w", encoding="utf-8") as jf:
        json.dump(meta, jf, indent=2)
    print(f"  Exported metadata: {meta_path}")

def main():
    manifest_sites = []
    for site in sites_meta["sites"]:
        if site["id"] in MVP_SITE_IDS:
            compute_site_dataset(site)
            manifest_sites.append({
                "id": site["id"],
                "name": site["name"],
                "region": site["region"],
                "lat_deg": site["lat_deg"],
                "lon_deg": site["lon_deg"],
                "elev_m": site["elev_m"],
                "status": site.get("status", "approximate"),
                "dataFile": f"data/{site['id']}.bin",
                "metaFile": f"data/{site['id']}.json"
            })

    manifest = {
        "source": sites_meta["source"],
        "disclaimer": sites_meta["disclaimer"],
        "ephemeris_engine": "NAIF SPICE (de440s.bsp, MOON_ME frame, moon_pa_de421)",
        "dem_source": "NASA LRO LOLA Gridded Data Record LDEM_75S_240M via PDS Geosciences Node",
        "start_utc": START_UTC,
        "end_utc": END_UTC,
        "step_seconds": STEP_SECONDS,
        "num_steps": num_steps,
        "sites": manifest_sites,
        "ai_use": "Generated with AI assistance under human scientific oversight."
    }

    manifest_path = os.path.join(OUTPUT_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as mf:
        json.dump(manifest, mf, indent=2)
    print(f"\n[DONE] Manifest written to {manifest_path} with {len(manifest_sites)} sites.")
    spice.kclear()

if __name__ == "__main__":
    main()
