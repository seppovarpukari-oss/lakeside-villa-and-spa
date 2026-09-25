# TLVS Native Localization — Work Status

Branch: `native-localization-2026-09-25`
Locked starting HEAD: `e5db1a5a402a3673da11501af9f82bf13b74c044`
Editorial source: en-GB production copy
Authoritative workbook verified at project start: `Tahko_Lakeside_Villa_Spa_Master_rekisteri_v1_165.xlsx`
No merge to `main`.

## 2026-09-25 FI Home owner approval

The Finnish Home visible editorial copy was finalized through owner review, using Claude for the initial native-language rewrite and Master v1_165 for fact control. The approved copy is now synchronized between `fi/index.html` and `assets/i18n/tlvs-translations.json` on this branch. No merge to `main` has been made.

## 2026-09-25 FI Home native-language correction

The earlier FI Home editorial naturalness sign-off is withdrawn. A manual read found translation-shaped wording, generic marketing language and phrases that were grammatically valid but not natural Finnish. FI Home has now been rewritten on this branch under `LOCALIZATION-GUIDE.md`, while preserving the approved en-GB meaning and locked facts. The translation bank and static FI Home HTML were updated together. No merge to `main` has been made from this correction.

Current native-language approval scope: **FI Home owner-approved on 2026-09-25; FI The Villa owner-approved on 2026-09-25; FI Lakeside Life owner-approved on 2026-09-25; FI Spa & Wellness owner-approved on 2026-09-25; FI Location owner-approved on 2026-09-25**. The earlier technical completeness checks remain useful as technical checks, but they are not evidence that the other localized pages or languages meet the native-language editorial standard.

## 2026-09-25 implementation and QA

The localization implementation covers fi, sv, nb/no, da, de, fr, es, nl, et, it and zh-CN. Each language was written from en-GB. Seven scoped pages per language are present: Home, The Villa, Lakeside Life, Spa & Wellness, Location, Private Services and The Villa, Documented. FI Home was replaced from the editorial source. The translation bank and localized static HTML were edited together. Serious Boating, Deep Roots, Private Winter Spa, Finnish Lakeland and Documented content outside the bank were included.

The editorial review compared the substantive English copy and its target-language counterparts for meaning, naturalness and concrete detail. Corrections included idiom and grammar, inland-waterway terminology, boating descriptions, winter-spa timing, region names and number presentation. A second technical pass found 50 Home links whose `>` had been encoded twice; all were repaired and a rendering regression test was added.

### Final checks from a fresh checkout of the GitHub branch

- All six bank page key sets match en-GB across all 11 target languages (282 keys per language).
- All 3,124 visible `data-i18n` fields match the target-language bank after one HTML entity decode, which reflects the rendered text; zero mismatches.
- All 77 scoped localized pages exist. Serious Boating, Deep Roots, Private Winter Spa and Finnish Lakeland sections exist for every language.
- Locked dimensions, names, dates and approximately 100 m winter-route distances were checked; locale number conventions were maintained.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v`: four tests pass, including the new CTA-rendering regression test.
- `git diff --check` passes. This branch is not merged into `main`.

Independent human native-editor certification across all 11 languages has not been obtained; this is an editorial and technical pass performed within the repository, not an external sign-off.

## FI editorial voice locked on 2026-09-25

Finnish web copy is written as original Finnish rather than as sentence-by-sentence translation. The approved voice is direct, natural and concrete: describe the villa, place, materials, features and distances; avoid telling readers how to spend their time, avoid self-evident "voi" constructions, and avoid generic translated marketing rhetoric. The approved Home, The Villa, Lakeside Life, Spa & Wellness and Location pages are the active Finnish style reference.
