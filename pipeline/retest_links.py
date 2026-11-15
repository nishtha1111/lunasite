# Portions of this file were generated with SI assistance (see SI_USE.md)
import urllib.request
import urllib.error
import ssl

ctx = ssl.create_default_context()

RETEST_URLS = [
    ("NASA PDS LOLA LDEM Directory", "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/"),
    ("NASA PDS LOLA LDEM Label", "https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/data/lola_gdr/polar/img/ldem_75s_240m.lbl"),
    ("NASA PDS LOLA LDEM Data Page", "https://pds-geosciences.wustl.edu/missions/lro/lola.htm"),
    ("NASA Space Apps Challenge 2026", "https://www.spaceappschallenge.org/"),
    ("Mazarico 2011 DOI", "https://doi.org/10.1016/j.icarus.2010.10.030"),
    ("Glaser 2014 DOI", "https://doi.org/10.1016/j.icarus.2014.08.013"),
    ("NASA ADS Mazarico 2011", "https://ui.adsabs.harvard.edu/abs/2011Icar..211.1066M/abstract"),
    ("TypeScript", "https://www.typescriptlang.org/"),
    ("Astropy", "https://www.astropy.org/"),
    ("PostCSS", "https://postcss.org/"),
    ("Microsoft Edge", "https://www.microsoft.com/en-us/edge")
]

for name, url in RETEST_URLS:
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        )
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            final_url = resp.geturl()
            status = resp.status
            # read first 100 bytes to ensure connection works
            chunk = resp.read(100)
            print(f"[OK {status}] {name} -> {final_url}")
    except urllib.error.HTTPError as e:
        print(f"[HTTP {e.code}] {name} -> {e.geturl() if hasattr(e, 'geturl') else url}")
    except Exception as e:
        print(f"[FAIL] {name} -> {e}")
