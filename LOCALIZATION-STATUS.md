# TLVS Native Localization — Work Status

Source branch: `native-localization-2026-09-25`
Locked starting HEAD: `e5db1a5a402a3673da11501af9f82bf13b74c044`
Editorial source: en-GB production copy
Authoritative workbook verified at project start: `Tahko_Lakeside_Villa_Spa_Master_rekisteri_v1_165.xlsx`
Production integration: localized content published from the source branch to `main` for GitHub Pages.

## 2026-09-25 implementation and QA

The localization implementation covers fi, sv, nb/no, da, de, fr, es, nl, et, it and zh-CN. Each language was written from en-GB. Seven scoped pages per language are present: Home, The Villa, Lakeside Life, Spa & Wellness, Location, Private Services and The Villa, Documented. FI Home was replaced from the editorial source. The translation bank and localized static HTML were edited together. Serious Boating, Deep Roots, Private Winter Spa, Finnish Lakeland and Documented content outside the bank were included.

The editorial review compared the substantive English copy and its target-language counterparts for meaning, naturalness and concrete detail. Corrections included idiom and grammar, inland-waterway terminology, boating descriptions, winter-spa timing, region names and number presentation. A second technical pass found 50 Home links whose `>` had been encoded twice; all were repaired and a rendering regression test was added.

### Final checks on the source branch and production integration

- All six bank page key sets match en-GB across all 11 target languages (282 keys per language).
- All 3,124 visible `data-i18n` fields match the target-language bank after one HTML entity decode, which reflects the rendered text; zero mismatches.
- All 77 scoped localized pages exist. Serious Boating, Deep Roots, Private Winter Spa and Finnish Lakeland sections exist for every language.
- Locked dimensions, names, dates and approximately 100 m winter-route distances were checked; locale number conventions were maintained.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v`: four tests pass, including the new CTA-rendering regression test.
- `git diff --check` passes. The production integration retains the source branch changes and existing main-only content.

Independent human native-editor certification across all 11 languages has not been obtained; this is an editorial and technical pass performed within the repository, not an external sign-off.
