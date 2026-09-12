from pathlib import Path
import re

COPY = {
    "index.html": {
        "ey": "THE VILLA, DOCUMENTED",
        "h": "Ask the property.",
        "p": "The villa’s systems, history and operating knowledge have been structured into one intelligent property record — ready to answer questions when they matter.",
        "cta": "EXPLORE THE VILLA, DOCUMENTED →",
        "href": "/the-villa-documented.html",
        "aria": "Documented property knowledge at Lakeside Villa & Spa",
    },
    "fi/index.html": {
        "ey": "HUVILA, DOKUMENTOITUNA",
        "h": "Kysy huvilalta.",
        "p": "Huvilan järjestelmät, historia ja käyttötieto on koottu yhdeksi älykkääksi kiinteistötiedoksi — valmiiksi vastaamaan silloin, kun tietoa tarvitaan.",
        "cta": "TUTUSTU DOKUMENTOITUUN HUVILAAN →",
        "href": "/fi/the-villa-documented.html",
        "aria": "Huvilan dokumentoitua teknistä tietoa kuvaava näkymä",
    },
    "sv/index.html": {"ey":"VILLAN, DOKUMENTERAD","h":"Fråga villan.","p":"Villans system, historia och driftskunskap har strukturerats i ett intelligent fastighetsregister — redo att ge svar när de behövs.","cta":"UTFORSKA DEN DOKUMENTERADE VILLAN →","href":"/sv/the-villa-documented.html","aria":"Dokumenterad fastighetskunskap vid Lakeside Villa & Spa"},
    "no/index.html": {"ey":"VILLAEN, DOKUMENTERT","h":"Spør villaen.","p":"Villaens systemer, historie og driftskunnskap er strukturert i ett intelligent eiendomsregister — klart til å gi svar når det trengs.","cta":"UTFORSK DEN DOKUMENTERTE VILLAEN →","href":"/no/the-villa-documented.html","aria":"Dokumentert eiendomskunnskap ved Lakeside Villa & Spa"},
    "da/index.html": {"ey":"VILLAEN, DOKUMENTERET","h":"Spørg villaen.","p":"Villaens systemer, historie og driftsviden er samlet i én intelligent ejendomsregistrering — klar til at give svar, når der er brug for dem.","cta":"UDFORSK DEN DOKUMENTEREDE VILLA →","href":"/da/the-villa-documented.html","aria":"Dokumenteret ejendomsviden ved Lakeside Villa & Spa"},
    "de/index.html": {"ey":"DIE VILLA, DOKUMENTIERT","h":"Fragen Sie die Villa.","p":"Systeme, Historie und Betriebswissen der Villa sind in einem intelligenten Objektwissen strukturiert — bereit für Antworten, wenn sie gebraucht werden.","cta":"DIE DOKUMENTIERTE VILLA ENTDECKEN →","href":"/de/the-villa-documented.html","aria":"Dokumentiertes Objektwissen der Lakeside Villa & Spa"},
    "fr/index.html": {"ey":"LA VILLA, DOCUMENTÉE","h":"Interrogez la villa.","p":"Les systèmes, l’histoire et le savoir d’exploitation de la villa sont structurés dans un dossier immobilier intelligent — prêt à répondre lorsque cela compte.","cta":"DÉCOUVRIR LA VILLA DOCUMENTÉE →","href":"/fr/the-villa-documented.html","aria":"Connaissance immobilière documentée de Lakeside Villa & Spa"},
    "es/index.html": {"ey":"LA VILLA, DOCUMENTADA","h":"Pregunta a la villa.","p":"Los sistemas, la historia y el conocimiento operativo de la villa se han estructurado en un único registro inteligente de la propiedad, listo para responder cuando importa.","cta":"DESCUBRIR LA VILLA DOCUMENTADA →","href":"/es/the-villa-documented.html","aria":"Conocimiento documentado de la propiedad Lakeside Villa & Spa"},
    "nl/index.html": {"ey":"DE VILLA, GEDOCUMENTEERD","h":"Vraag het de villa.","p":"De systemen, geschiedenis en operationele kennis van de villa zijn samengebracht in één intelligent vastgoeddossier — klaar om antwoord te geven wanneer dat nodig is.","cta":"ONTDEK DE GEDOCUMENTEERDE VILLA →","href":"/nl/the-villa-documented.html","aria":"Gedocumenteerde vastgoedkennis van Lakeside Villa & Spa"},
    "et/index.html": {"ey":"VILLA, DOKUMENTEERITUD","h":"Küsi villalt.","p":"Villa süsteemid, ajalugu ja kasutusteadmised on koondatud üheks intelligentseks kinnisvarateadmiste kogumiks — valmis vastama siis, kui seda vaja on.","cta":"AVASTA DOKUMENTEERITUD VILLA →","href":"/et/the-villa-documented.html","aria":"Lakeside Villa & Spa dokumenteeritud kinnisvarateadmised"},
    "it/index.html": {"ey":"LA VILLA, DOCUMENTATA","h":"Chiedi alla villa.","p":"Sistemi, storia e conoscenze operative della villa sono strutturati in un unico patrimonio informativo intelligente — pronto a rispondere quando serve.","cta":"SCOPRI LA VILLA DOCUMENTATA →","href":"/it/the-villa-documented.html","aria":"Conoscenza documentata della proprietà Lakeside Villa & Spa"},
    "zh-cn/index.html": {"ey":"别墅档案","h":"向别墅提问。","p":"别墅的系统、历史与运营知识已被整理为一套智能房产知识记录，在真正需要时提供清晰答案。","cta":"探索别墅档案 →","href":"/zh-cn/the-villa-documented.html","aria":"Lakeside Villa & Spa 的房产知识档案"},
}

STYLE_LINK = '<link rel="stylesheet" href="/assets/documented.css"/>'

for filename, t in COPY.items():
    path = Path(filename)
    html = path.read_text(encoding="utf-8")
    if STYLE_LINK not in html:
        html = html.replace("</head>", STYLE_LINK + "\n</head>", 1)
    if 'class="tlvs-documented-teaser"' not in html:
        teaser = (
            '<section class="tlvs-documented-teaser" id="documented" aria-labelledby="documented-teaser-title">'
            '<div class="doc-teaser-copy">'
            f'<div class="eyebrow">{t["ey"]}</div>'
            f'<h2 id="documented-teaser-title">{t["h"]}</h2>'
            f'<p>{t["p"]}</p>'
            f'<a class="cta" href="{t["href"]}">{t["cta"]}</a>'
            '</div>'
            f'<div class="doc-teaser-media" role="img" aria-label="{t["aria"]}"></div>'
            '</section>'
        )
        pattern = re.compile(r'(<section class="editorial section-spa".*?</section>)(<section class="editorial section-lake")', re.S)
        html, n = pattern.subn(r'\1' + teaser + r'\2', html, count=1)
        if n != 1:
            raise RuntimeError(f"Could not locate Spa→Lake insertion point in {filename}")
    path.write_text(html, encoding="utf-8")

# Consent code remains consent-only: remove the temporary teaser loader added during QA.
consent = Path("assets/site-consent.js")
text = consent.read_text(encoding="utf-8")
marker = "\n/* Shared loader for the locked Home Documented teaser."
if marker in text:
    text = text.split(marker, 1)[0].rstrip() + "\n"
consent.write_text(text, encoding="utf-8")

# The small Documented integration script is now only responsible for adding the
# existing 12-language picker to the mobile menu on the new Documented pages.
Path("assets/documented-teaser.js").write_text("""/* TLVS Documented mobile language picker. */\n(function(){\n  'use strict';\n  if(!document.body || !document.body.classList.contains('documented-page')) return;\n  const mobilePanel=document.querySelector('.mobile-nav-panel');\n  const desktopPicker=document.querySelector('.desktop-nav .tlvs-language-picker');\n  if(mobilePanel && desktopPicker && !mobilePanel.querySelector('.tlvs-language-picker')){\n    const picker=desktopPicker.cloneNode(true);\n    picker.classList.add('mobile-language-picker');\n    mobilePanel.appendChild(picker);\n  }\n}());\n""", encoding="utf-8")

# Load the mobile-picker helper only on Documented pages, not globally.
documented_pages = ["the-villa-documented.html"] + [f"{folder}/the-villa-documented.html" for folder in ["fi","sv","no","da","de","fr","es","nl","et","it","zh-cn"]]
for filename in documented_pages:
    path = Path(filename)
    html = path.read_text(encoding="utf-8")
    tag = '<script defer src="/assets/documented-teaser.js"></script>'
    if tag not in html:
        html = html.replace("</body>", tag + "\n</body>", 1)
    path.write_text(html, encoding="utf-8")

print("Static Documented teaser finalized on all 12 Home pages.")
