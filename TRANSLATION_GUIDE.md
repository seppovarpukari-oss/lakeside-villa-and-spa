# TLVS Translation Policy

## Canonical source
English (`en`) is the only source language. Other languages are derived from English.

## Supported languages
English, Finnish, Swedish, Norwegian Bokmål, Danish, German, French, Spanish, Dutch, Estonian, Italian and Simplified Chinese.

## Quality rule
The approved English (`en-GB`) production copy is the complete editorial content master. It is not a draft, a fact summary or raw material for shorter marketing copy.

Every localization must preserve the full communicative content of the English source: every substantive idea, explanation, relationship, concrete observation and factual nuance. If the English copy explains how a place is used, what a guest sees or does, or why a feature matters, the localized copy must also explain it.

Localize the language, not the amount of meaning. A native writer may freely change syntax, sentence boundaries, idiom, rhythm and word order so the result reads as if it was originally written in the target language. Do not copy English sentence structure when that sounds unnatural.

Do **not** summarize, compress, abstract, sloganize or simplify away content merely to make it shorter, sharper or more "web-friendly". Shortness is not a quality target. Body copy may use two or three natural sentences, or more when the target language needs them to preserve the approved English meaning clearly. "One screen / one idea" does not mean "one sentence / one idea".

Prefer clear, concrete, place-aware language over abstract marketing vocabulary. Describe what the place is like, how it is used and why details matter. Avoid hospitality clichés, imperative experience-language and generic luxury/premium self-praise.

Headings may remain concise enough for the approved layout, but layout fit must never be solved by deleting meaning from body copy.

### Mandatory paragraph back-check
For every changed localized paragraph, compare it directly with the approved English paragraph before release:
1. Is every meaningful English idea still present?
2. Is every factual relationship still correct?
3. Has any concrete explanation been replaced by an abstract phrase or slogan?
4. Does the target text read naturally if the reader never sees the English?
5. Was anything shortened only because shorter copy seemed preferable?

If any answer indicates lost meaning or artificial compression, the localization fails QA even if the grammar is correct.

Each language is localized independently from English. Finnish is not the source for other languages; Swedish is not the source for Norwegian; no localized language is a pivot language.

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
