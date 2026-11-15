# Portions of this file were generated with SI assistance (see SI_USE.md)
import urllib.request
import urllib.error
import ssl

ctx = ssl.create_default_context()

NASA_URLS = [
    ("NASA PDS Geosciences Node: LOLA LDEM_75S_240M Product Directory", "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/"),
    ("NASA PDS Geosciences Node: LOLA LDEM_75S_240M Label (LDEM_75S_240M.LBL)", "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.lbl"),
    ("NASA PDS Geosciences Node: LOLA LDEM_75S_240M Binary Elevation Grid (LDEM_75S_240M.IMG)", "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.img"),
    ("NASA NAIF SPICE Planetary Ephemeris SPK Directory", "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/"),
    ("NASA NAIF SPICE Planetary Ephemeris Kernel (de440s.bsp)", "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440s.bsp"),
    ("NASA NAIF SPICE Lunar Frame Kernel (moon_080317.tf)", "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/fk/satellites/moon_080317.tf"),
    ("NASA NAIF SPICE Lunar Binary Orientation PCK (moon_pa_de421_1900-2050.bpc)", "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/moon_pa_de421_1900-2050.bpc"),
    ("NASA NAIF SPICE Leapseconds Kernel (naif0012.tls)", "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/lsk/naif0012.tls"),
    ("NASA NAIF SPICE Physical Constants Kernel (pck00010.tpc)", "https://naif.jpl.nasa.gov/pub/naif/generic_kernels/pck/pck00010.tpc"),
    ("NASA Press Release 22-088: Artemis III Candidate Landing Regions", "https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-moon/"),
    ("NASA Space Apps Challenge 2026 Portal", "https://www.spaceappschallenge.org"),
    ("LPI/USRA Lunar South Pole Atlas (Cartographic Regional Data)", "https://www.lpi.usra.edu/lunar/lunar-south-pole-atlas/"),
    ("NASA ADS: Mazarico et al. (2011) Illumination of Lunar Polar Regions", "https://ui.adsabs.harvard.edu/abs/2011Icar..211.1066M/abstract"),
    ("NASA ADS: Gläser et al. (2014) Illumination Conditions at Lunar Poles", "https://ui.adsabs.harvard.edu/abs/2014Icar..243...78G/abstract")
]

OTHER_URLS = [
    ("React (MIT)", "https://react.dev/"),
    ("Vite (MIT)", "https://vite.dev/"),
    ("TypeScript (Apache-2.0)", "https://www.typescriptlang.org/"),
    ("Tailwind CSS (MIT)", "https://tailwindcss.com/"),
    ("Lucide React (ISC)", "https://lucide.dev/"),
    ("Vitest (MIT)", "https://vitest.dev/"),
    ("SpiceyPy (MIT)", "https://spiceypy.readthedocs.io/"),
    ("NumPy (BSD-3-Clause)", "https://numpy.org/"),
    ("SciPy (BSD-3-Clause)", "https://scipy.org/"),
    ("Astropy (BSD-3-Clause)", "https://www.astropy.org/"),
    ("jplephem (MIT)", "https://github.com/brandon-rhodes/python-jplephem"),
    ("clsx (MIT)", "https://github.com/lukeed/clsx"),
    ("tailwind-merge (MIT)", "https://github.com/dcastil/tailwind-merge"),
    ("PostCSS (MIT)", "https://postcss.org/"),
    ("Autoprefixer (MIT)", "https://github.com/postcss/autoprefixer"),
    ("Google Fonts: Inter (OFL-1.1)", "https://fonts.google.com/specimen/Inter"),
    ("Google Fonts: JetBrains Mono (OFL-1.1)", "https://fonts.google.com/specimen/JetBrains+Mono"),
    ("Python (PSF)", "https://www.python.org/"),
    ("uv (MIT/Apache-2.0)", "https://docs.astral.sh/uv/"),
    ("Microsoft Edge (Proprietary)", "https://www.microsoft.com/edge")
]

def test_url(name, url):
    try:
        # Use HEAD or GET with Range to prevent large file download
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Range': 'bytes=0-1024'
            }
        )
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            final_url = resp.geturl()
            status = resp.status
            return status, final_url, None
    except urllib.error.HTTPError as e:
        return e.code, e.geturl() if hasattr(e, 'geturl') else url, str(e)
    except Exception as e:
        return None, url, str(e)

print("=== TESTING NASA URLS ===")
for name, url in NASA_URLS:
    status, final_url, err = test_url(name, url)
    print(f"[{status}] {name} -> {final_url} (err: {err})")

print("\n=== TESTING OTHER URLS ===")
for name, url in OTHER_URLS:
    status, final_url, err = test_url(name, url)
    print(f"[{status}] {name} -> {final_url} (err: {err})")
