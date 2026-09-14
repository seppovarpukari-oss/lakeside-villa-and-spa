# TLVS Translation Policy

## Canonical source
English (`en`) is the only source language. Other languages are derived from English.

## Supported languages
English, Finnish, Swedish, Norwegian Bokmål, Danish, German, French, Spanish, Dutch, Estonian, Italian and Simplified Chinese.

## Quality rule
Translate for a premium private-lakeside hospitality audience. Preserve meaning, restraint and editorial tone rather than translating word-for-word. Headings should stay concise enough to fit the approved layout.

For **The Villa, Documented**, the approved English production copy is locked. Localized versions must preserve the same meaning and information hierarchy; they must not introduce extra claims, extra access levels, or device-specific wording that is not present in the approved English source.

## Locked names and terms
Do not translate: Lakeside Villa & Spa, Tahko, Kuopio, Siilinjärvi, Syväri, Tahkolahti, Lastukoski, Old Course, Lake & Forest.

## Future automation
When English copy changes:
1. Detect only changed source keys.
2. Translate only those changed keys.
3. Reuse approved translations for unchanged keys.
4. Keep locked terms unchanged.
5. Never expose API keys in browser JavaScript.
6. Cache approved/generated translations.
7. Allow important hero/brand copy to be manually locked.

## Visual integrity
Translation updates must not change CSS, images, spacing, breakpoints, typography rules, or DOM layout. If a translation is too long, improve the translation rather than changing the approved design.

## Fact-grid release check
Run `python3 tests/fact_languages.py` before publishing. The same check runs on pushes and pull requests through `.github/workflows/fact-languages.yml`.
It verifies all 12 language pages, HTML language tags, matching fact-section IDs and text-field counts, and English source text accidentally left in a localized grid. Both `p0098-facts` sections and the Location page's `glance` section are covered. Shared vocabulary is explicitly allowed per language; do not add a phrase to this list merely to silence a missing translation.
The Location grid's translatable labels have `distance*` keys in the translation inventory. Its regression tests also verify inventory consistency and unchanged numeric distances. Run `python3 -m unittest discover -s tests -p 'test_fact_languages.py'` to exercise these checks, including a deliberately reintroduced English label.
This structural check does not judge translation quality or detect stale but translated facts. Review changed facts in every language and check the published page and language-switch links. Require the `translations` status check in branch protection if it should block merging; the workflow alone does not prevent direct publication.
