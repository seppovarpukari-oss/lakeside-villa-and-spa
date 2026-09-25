"""Structural lock for approved Finnish localization.

Visible Finnish copy may be edited only when explicitly approved. Localization work must not
silently change DOM structure, CSS, scripts, links, images, classes or IDs. If an intentional
structural change is approved, update the corresponding fingerprint deliberately.
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EXPECTED = {
    "fi/index.html": {"dom": "643a44810ee6b608", "styles": "d34d895959aa250f", "scripts": "d2ef9f5164273b02"},
    "fi/the-villa.html": {"dom": "3116a0a87aa9eaa8", "styles": "547ae699a50406ed", "scripts": "9a6523632eef4915"},
    "fi/lakeside-life.html": {"dom": "13ed291fa60240b9", "styles": "808e4e36085385f9", "scripts": "8841630350f83b06"},
    "fi/spa-wellness.html": {"dom": "a3ca6b0409334db8", "styles": "1c415ce4551af47b", "scripts": "695bbe1c6890d927"},
    "fi/location.html": {"dom": "d23a130204b9dfdd", "styles": "1a0e8e1587aff891", "scripts": "67c6e83dc77a7dde"},
    "fi/private-services.html": {"dom": "512a2ca117062eab", "styles": "18cf20c598ae57f3", "scripts": "2f2ae7e0e0e7a2d2"},
    "fi/the-villa-documented.html": {"dom": "44057af1e1c061b3", "styles": "cbf29ce484222325", "scripts": "7c5fd21b262e5806"},
}

ATTRS = ("class", "id", "data-i18n", "href", "src", "role", "aria-labelledby", "name", "type")

def fnv1a64_utf16le(text: str) -> str:
    h = 0xCBF29CE484222325
    for byte in text.encode("utf-16le"):
        h ^= byte
        h = (h * 0x100000001B3) & 0xFFFFFFFFFFFFFFFF
    return f"{h:016x}"

def attr_token(raw: str) -> str:
    parts = []
    for key in ATTRS:
        match = re.search(rf'\b{re.escape(key)}=["\']([^"\']*)["\']', raw, re.I)
        if match:
            parts.append(f"{key}={match.group(1)}")
    if re.search(r'\bhidden\b', raw, re.I):
        parts.append("hidden")
    return "|".join(parts)

def signatures(html: str):
    body_match = re.search(r"<body\b[\s\S]*?</body>", html, re.I)
    body = body_match.group(0) if body_match else ""
    sans = re.sub(r"<!--[\s\S]*?-->", "", body)
    sans = re.sub(r"<style\b[\s\S]*?</style>", "", sans, flags=re.I)
    sans = re.sub(r"<script\b[\s\S]*?</script>", "", sans, flags=re.I)
    tokens = []
    for match in re.finditer(r"</?([a-zA-Z0-9-]+)\b[^>]*>", sans):
        raw = match.group(0)
        tag = match.group(1).lower()
        if raw.startswith("</"):
            tokens.append(f"/{tag}")
        else:
            tokens.append(f"{tag}|{attr_token(raw)}")
    styles = "\n---\n".join(
        re.sub(r"\s+", " ", m.group(1)).strip()
        for m in re.finditer(r"<style\b[^>]*>([\s\S]*?)</style>", html, re.I)
    )
    scripts = []
    for m in re.finditer(r"<script\b([^>]*)>([\s\S]*?)</script>", html, re.I):
        src = re.search(r'\bsrc=["\']([^"\']+)["\']', m.group(1), re.I)
        if src:
            scripts.append(f"SRC:{src.group(1)}")
        else:
            scripts.append("INLINE:" + re.sub(r"\s+", " ", m.group(2)).strip())
    return {
        "dom": fnv1a64_utf16le("\n".join(tokens)),
        "styles": fnv1a64_utf16le(styles),
        "scripts": fnv1a64_utf16le("\n---\n".join(scripts)),
    }

class FinnishStructureLockTest(unittest.TestCase):
    def test_locked_structure_css_and_scripts(self):
        for relative, expected in EXPECTED.items():
            html = (ROOT / relative).read_text()
            actual = signatures(html)
            self.assertEqual(expected, actual, relative)

    def test_fact_grids_keep_primary_secondary_and_structure_slot(self):
        pages = [
            ("fi/index.html", "at-a-glance", "p0098-item"),
            ("fi/the-villa.html", "villa-facts", "p0098-item"),
            ("fi/lakeside-life.html", "lakeside-facts", "p0098-item"),
            ("fi/spa-wellness.html", "spa-facts", "p0098-item"),
            ("fi/location.html", "glance", "stat"),
            ("fi/private-services.html", "service-facts", "p0098-item"),
        ]
        for relative, section_id, item_class in pages:
            html = (ROOT / relative).read_text()
            section = re.search(
                rf'<section\b[^>]*id=["\']{re.escape(section_id)}["\'][\s\S]*?</section>',
                html, re.I
            )
            self.assertIsNotNone(section, relative)
            section_html = section.group(0)
            self.assertRegex(section_html, r"<h2\b[^>]*>[^<]+</h2>")
            items = list(re.finditer(
                rf'<div\b[^>]*class=["\'][^"\']*\b{re.escape(item_class)}\b[^"\']*["\'][^>]*>([\s\S]*?)</div>',
                section_html, re.I
            ))
            self.assertGreater(len(items), 0, relative)
            for index, item in enumerate(items, 1):
                inner = item.group(1)
                self.assertRegex(inner, r"<strong\b[^>]*>\s*[^<]+\s*</strong>", f"{relative} item {index}")
                self.assertRegex(inner, r"<span\b[^>]*>\s*[^<]+\s*</span>", f"{relative} item {index}")
                self.assertRegex(inner, r"<small\b[^>]*>[\s\S]*?</small>", f"{relative} item {index}")

if __name__ == "__main__":
    unittest.main()
