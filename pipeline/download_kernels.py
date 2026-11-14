"""
Portions of this file were generated with AI assistance.
Download and verify NAIF SPICE kernels required for Moon topocentric ephemerides.
"""

import os
import sys
import urllib.request

KERNELS_DIR = os.path.join(os.path.dirname(__file__), "kernels")
os.makedirs(KERNELS_DIR, exist_ok=True)

KERNEL_URLS = {
    "naif0012.tls": "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/lsk/naif0012.tls",
    "pck00010.tpc": "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00010.tpc",
    "moon_080317.tf": "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/fk/satellites/moon_080317.tf",
    "moon_pa_de421_1900-2050.bpc": "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/moon_pa_de421_1900-2050.bpc",
    "de440s.bsp": "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440s.bsp",
}

def download_file(url: str, dest_path: str):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        print(f"[OK] Already exists: {os.path.basename(dest_path)} ({os.path.getsize(dest_path)} bytes)")
        return
    print(f"[DOWNLOADING] {url} -> {dest_path}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (LunaSite/1.0; NASA Space Apps)'})
    with urllib.request.urlopen(req, timeout=60) as resp, open(dest_path, "wb") as out:
        total = int(resp.headers.get("Content-Length", 0))
        downloaded = 0
        chunk_size = 65536
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            out.write(chunk)
            downloaded += len(chunk)
            if total > 0 and downloaded % (1024 * 1024) < chunk_size:
                sys.stdout.write(f"\r  {downloaded / (1024*1024):.1f} MB / {total / (1024*1024):.1f} MB ({(downloaded/total)*100:.1f}%)")
                sys.stdout.flush()
    print(f"\n[DONE] Saved {os.path.basename(dest_path)} ({os.path.getsize(dest_path)} bytes)")

def main():
    print("=== Downloading NAIF SPICE Kernels ===")
    for filename, url in KERNEL_URLS.items():
        dest = os.path.join(KERNELS_DIR, filename)
        try:
            download_file(url, dest)
        except Exception as e:
            print(f"[ERROR] Failed to download {filename}: {e}", file=sys.stderr)
            sys.exit(1)
    print("All SPICE kernels downloaded successfully.")

if __name__ == "__main__":
    main()
