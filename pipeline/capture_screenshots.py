"""
Portions of this file were generated with AI assistance.
LunaSite Automated Browser Headless Screenshot Capture.
Uses Microsoft Edge in headless mode to render the web app and capture high-resolution screenshots.
"""

import os
import sys
import time
import shutil
import subprocess
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "web", "dist"))
SCREENSHOTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "submission", "screenshots"))
ARTIFACT_DIR = r"C:\Users\Nishtha patel\.gemini\antigravity\brain\dac62b62-8604-49c4-a577-3af8849dad33"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

def run_server(httpd):
    httpd.serve_forever()

def capture_screenshot(url: str, output_path: str, width: int = 1600, height: int = 1000):
    print(f"[CAPTURE] Rendering {url} ({width}x{height}) -> {output_path}")
    cmd = [
        EDGE_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        f"--window-size={width},{height}",
        f"--screenshot={output_path}",
        url
    ]
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if os.path.exists(output_path):
        size_kb = os.path.getsize(output_path) / 1024
        print(f"  [SUCCESS] Captured: {os.path.basename(output_path)} ({size_kb:.1f} KB)")
        # Copy to artifact dir
        dest = os.path.join(ARTIFACT_DIR, os.path.basename(output_path))
        shutil.copy2(output_path, dest)
    else:
        print(f"  [ERROR] Screenshot file not generated. STDERR: {p.stderr}")

def main():
    port = 8092
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, CustomHandler)
    server_thread = threading.Thread(target=run_server, args=(httpd,), daemon=True)
    server_thread.start()
    print(f"Local static server running at http://localhost:{port}/")
    time.sleep(1)

    try:
        # 1. Desktop Compare View with Best-Window Finder (1600x1100)
        s1 = os.path.join(SCREENSHOTS_DIR, "m3_compare_view.png")
        capture_screenshot(f"http://localhost:{port}/#sites=shackleton_peak,connecting_ridge,malapert_massif&view=compare", s1, 1600, 1100)

        # 2. Horizon 360° Panorama View (1600x1000)
        s2 = os.path.join(SCREENSHOTS_DIR, "m3_horizon_view.png")
        capture_screenshot(f"http://localhost:{port}/#view=horizon", s2, 1600, 1000)

        # 3. Learn Mode Walkthrough & Glossary (1600x1000)
        s3 = os.path.join(SCREENSHOTS_DIR, "m3_learn_view.png")
        capture_screenshot(f"http://localhost:{port}/#view=learn", s3, 1600, 1000)

        # 4. Mobile View (390x844 iPhone resolution)
        s4 = os.path.join(SCREENSHOTS_DIR, "m3_mobile_view.png")
        capture_screenshot(f"http://localhost:{port}/#view=compare", s4, 390, 844)

    finally:
        httpd.shutdown()
        print("Server shutdown complete.")

if __name__ == "__main__":
    main()
