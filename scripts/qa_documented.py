from pathlib import Path
import re
import sys

folders = ["", "fi", "sv", "no", "da", "de", "fr", "es", "nl", "et", "it", "zh-cn"]
langs = ["en", "fi", "sv", "nb", "da", "de", "fr", "es", "nl", "et", "it", "zh-CN"]
errors = []

def home_path(folder):
    return Path(folder) / "index.html" if folder else Path("index.html")

def doc_path(folder):
    return Path(folder) / "the-villa-documented.html" if folder else Path("the-villa-documented.html")

for folder in folders:
    hp = home_path(folder)
    text = hp.read_text(encoding="utf-8")
    if text.count('class="tlvs-documented-teaser"') != 1:
        errors.append(f"{hp}: expected exactly one static Documented teaser")
    spa = text.find('class="editorial section-spa"')
    teaser = text.find('class="tlvs-documented-teaser"')
    lake = text.find('class="editorial section-lake"')
    if not (spa >= 0 and teaser > spa and lake > teaser):
        errors.append(f"{hp}: teaser is not between Spa and Lakeside Life")
    if '/assets/documented.css' not in text:
        errors.append(f"{hp}: documented.css missing")
    if 'documented-teaser.js' in text:
        errors.append(f"{hp}: Home must not depend on documented-teaser.js")

for folder in folders:
    dp = doc_path(folder)
    text = dp.read_text(encoding="utf-8")
    url = "https://lakesidevillaandspa.com/" + ((folder + "/") if folder else "") + "the-villa-documented.html"
    if f'rel="canonical" href="{url}"' not in text and f'href="{url}" rel="canonical"' not in text:
        errors.append(f"{dp}: canonical mismatch")
    for lang in langs:
        if f'hreflang="{lang}"' not in text:
            errors.append(f"{dp}: missing hreflang {lang}")
    if 'hreflang="x-default"' not in text:
        errors.append(f"{dp}: missing x-default")
    if len(re.findall(r'<h1\b', text, flags=re.I)) != 1:
        errors.append(f"{dp}: expected exactly one H1")
    for level in ["Explore", "Verified Property Access", "Owner Access"]:
        if level not in text:
            errors.append(f"{dp}: missing locked access level {level}")
    if '/assets/documented-teaser.js' not in text:
        errors.append(f"{dp}: mobile language-picker helper missing")
    # Documented is intentionally not a new main-nav link.
    nav_start = text.find('class="nav desktop-nav"')
    nav_end = text.find('</nav>', nav_start)
    if nav_start >= 0 and nav_end > nav_start and 'the-villa-documented.html' in text[nav_start:nav_end]:
        errors.append(f"{dp}: Documented must not be added to main navigation")

consent = Path("assets/site-consent.js").read_text(encoding="utf-8")
if 'documented-teaser.js' in consent or 'Documented teaser' in consent:
    errors.append("assets/site-consent.js: consent code still loads Documented teaser")

helper = Path("assets/documented-teaser.js").read_text(encoding="utf-8")
if 'insertAdjacentElement' in helper or 'tlvs-documented-teaser' in helper:
    errors.append("assets/documented-teaser.js: helper still injects Home content")

sitemap = Path("sitemap.xml").read_text(encoding="utf-8")
for folder in folders:
    url = "https://lakesidevillaandspa.com/" + ((folder + "/") if folder else "") + "the-villa-documented.html"
    if sitemap.count(url) != 1:
        errors.append(f"sitemap.xml: expected exactly one {url}")

css = Path("assets/documented.css").read_text(encoding="utf-8")
for breakpoint in ["1200px", "900px", "560px"]:
    if breakpoint not in css:
        errors.append(f"assets/documented.css: responsive breakpoint {breakpoint} missing")

if errors:
    print("TLVS Documented QA FAILED")
    for error in errors:
        print("-", error)
    sys.exit(1)

print("TLVS Documented QA PASSED")
print("12 Home pages: static teaser present between Spa and Lakeside Life")
print("12 Documented pages: canonical + 12 hreflangs + x-default + one H1 + locked access levels")
print("Consent remains independent; sitemap contains all 12 Documented URLs")
