"""
Portions of this file were generated with AI assistance.
Download NASA LRO LOLA South Pole Digital Elevation Model (LDEM_75S_240M.IMG).
"""

import os
import sys
import urllib.request

DEM_DIR = os.path.join(os.path.dirname(__file__), "dem")
os.makedirs(DEM_DIR, exist_ok=True)

DEM_URL = "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img"
DEM_FILE = os.path.join(DEM_DIR, "ldem_75s_240m.img")
EXPECTED_BYTES = 29062688

def main():
    print(f"=== Downloading LOLA South Pole DEM ({EXPECTED_BYTES / (1024*1024):.1f} MB) ===")
    if os.path.exists(DEM_FILE) and os.path.getsize(DEM_FILE) == EXPECTED_BYTES:
        print(f"[OK] DEM already downloaded: {DEM_FILE} ({os.path.getsize(DEM_FILE)} bytes)")
        return

    req = urllib.request.Request(DEM_URL, headers={'User-Agent': 'Mozilla/5.0 (LunaSite/1.0; NASA Space Apps)'})
    with urllib.request.urlopen(req, timeout=90) as resp, open(DEM_FILE, "wb") as out:
        total = int(resp.headers.get("Content-Length", EXPECTED_BYTES))
        downloaded = 0
        chunk_size = 131072
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            out.write(chunk)
            downloaded += len(chunk)
            if total > 0 and downloaded % (1024 * 1024) < chunk_size:
                sys.stdout.write(f"\r  Downloaded {downloaded / (1024*1024):.1f} MB / {total / (1024*1024):.1f} MB ({(downloaded/total)*100:.1f}%)")
                sys.stdout.flush()

    actual_size = os.path.getsize(DEM_FILE)
    print(f"\n[DONE] Saved DEM to {DEM_FILE} ({actual_size} bytes)")
    if actual_size != EXPECTED_BYTES:
        print(f"[WARNING] Size mismatch: expected {EXPECTED_BYTES}, got {actual_size}")

if __name__ == "__main__":
    main()
