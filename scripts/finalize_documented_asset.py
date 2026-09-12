from pathlib import Path
import re

IMAGE_REL = "images/warm-evening-nibe-technical-still-life.webp"
IMAGE_URL = "https://lakesidevillaandspa.com/assets/images/warm-evening-nibe-technical-still-life.webp"
OLD_URL = "https://lakesidevillaandspa.com/assets/images/32fad850771599c9.jpg"

asset = Path("assets/images/warm-evening-nibe-technical-still-life.webp")
if not asset.exists() or asset.stat().st_size < 40000:
    raise SystemExit("Approved Warm Evening NIBE image asset is missing or unexpectedly small")

css_path = Path("assets/documented.css")
css = css_path.read_text(encoding="utf-8")
css = css.replace("url('images/32fad850771599c9.jpg')", f"url('{IMAGE_REL}')")
css = css.replace("/* Home teaser — injected only on home URLs by documented-teaser.js. */", "/* Home teaser — static HTML on each crawlable Home page. */")
if css.count(IMAGE_REL) < 2:
    raise SystemExit("Expected both Documented hero and Home teaser to use approved NIBE image")
css_path.write_text(css, encoding="utf-8")

folders = ["", "fi", "sv", "no", "da", "de", "fr", "es", "nl", "et", "it", "zh-cn"]
for folder in folders:
    p = Path(folder) / "the-villa-documented.html" if folder else Path("the-villa-documented.html")
    text = p.read_text(encoding="utf-8")
    text = text.replace(OLD_URL, IMAGE_URL)
    if text.count(IMAGE_URL) < 2:
        raise SystemExit(f"{p}: OG/Twitter approved image reference missing")
    p.write_text(text, encoding="utf-8")

# Restore the explicitly locked English wording where earlier mockup iterations had drifted.
p = Path("the-villa-documented.html")
text = p.read_text(encoding="utf-8")
text = text.replace(
    "Press power on the Harvia Xafir wall panel, set the desired temperature and allow about one hour for the sauna to reach 80 °C.",
    "Press power on the wall panel, set the temperature and allow about one hour for the sauna to reach 80 °C."
)
text = text.replace(
    "The Villa Assistant makes documented property knowledge accessible at the right level — from everyday use to deeper technical and due-diligence questions.",
    "The Villa Assistant makes this knowledge easier to explore. It answers from documented property information rather than guessing."
)
text = text.replace(
    "Open access provides useful information about the villa and its documented history. Verified access can reveal deeper technical and due-diligence information. Operational knowledge remains available to the owner.",
    "Open access provides useful information about the villa, its systems and documented history. More detailed technical and due-diligence information can be made available through verified property access. Operational knowledge remains available to the owner."
)
locked = [
    "Press power on the wall panel, set the temperature and allow about one hour for the sauna to reach 80 °C.",
    "The Villa Assistant makes this knowledge easier to explore. It answers from documented property information rather than guessing.",
    "Open access provides useful information about the villa, its systems and documented history. More detailed technical and due-diligence information can be made available through verified property access. Operational knowledge remains available to the owner.",
    "A future owner receives not only the property, but its operational knowledge with it."
]
for phrase in locked:
    if phrase not in text:
        raise SystemExit(f"English locked copy missing: {phrase}")
p.write_text(text, encoding="utf-8")

# Structural checks across the final candidate.
langs = ["en", "fi", "sv", "nb", "da", "de", "fr", "es", "nl", "et", "it", "zh-CN"]
for folder in folders:
    home = Path(folder) / "index.html" if folder else Path("index.html")
    h = home.read_text(encoding="utf-8")
    if h.count('class="tlvs-documented-teaser"') != 1:
        raise SystemExit(f"{home}: static teaser count is not exactly one")
    spa, teaser, lake = h.find('class="editorial section-spa"'), h.find('class="tlvs-documented-teaser"'), h.find('class="editorial section-lake"')
    if not (spa >= 0 and spa < teaser < lake):
        raise SystemExit(f"{home}: teaser is not between Spa & Wellness and Lakeside Life")
    if "documented-teaser.js" in h:
        raise SystemExit(f"{home}: Home still depends on Documented JS")

    doc = Path(folder) / "the-villa-documented.html" if folder else Path("the-villa-documented.html")
    d = doc.read_text(encoding="utf-8")
    if len(re.findall(r"<h1\b", d, flags=re.I)) != 1:
        raise SystemExit(f"{doc}: expected exactly one H1")
    for lang in langs:
        if f'hreflang="{lang}"' not in d:
            raise SystemExit(f"{doc}: missing hreflang {lang}")
    if 'hreflang="x-default"' not in d:
        raise SystemExit(f"{doc}: missing x-default")
    for level in ["Explore", "Verified Property Access", "Owner Access"]:
        if level not in d:
            raise SystemExit(f"{doc}: missing locked access level {level}")

consent = Path("assets/site-consent.js").read_text(encoding="utf-8")
if "documented-teaser.js" in consent:
    raise SystemExit("Consent module must remain independent of Documented integration")

helper = Path("assets/documented-teaser.js").read_text(encoding="utf-8")
if "insertAdjacentElement" in helper or "tlvs-documented-teaser" in helper:
    raise SystemExit("Documented helper must not inject Home content")

sitemap = Path("sitemap.xml").read_text(encoding="utf-8")
for folder in folders:
    url = "https://lakesidevillaandspa.com/" + ((folder + "/") if folder else "") + "the-villa-documented.html"
    if sitemap.count(url) != 1:
        raise SystemExit(f"sitemap expected exactly one URL: {url}")

print("FINAL_DOCUMENTED_QA=PASS")
print(f"APPROVED_IMAGE_BYTES={asset.stat().st_size}")
print("HOME_STATIC_TEASERS=12")
print("DOCUMENTED_CRAWLABLE_PAGES=12")
print("HREFLANG_SET=12+x-default")
print("CONSENT_SEPARATION=PASS")
print("ENGLISH_LOCKED_COPY=PASS")
