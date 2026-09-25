# TLVS Native Localization — Work Status

Branch: `native-localization-2026-09-25`  
Locked starting HEAD: `e5db1a5a402a3673da11501af9f82bf13b74c044`  
Authoritative workbook: `Tahko_Lakeside_Villa_Spa_Master_rekisteri_v1_165.xlsx` (verified readable)  
Editorial source: en-GB production copy  
Production `main`: no merge from this localization branch.

## 2026-09-25 completion checkpoint

The editorial localization pass covers all 11 target languages: fi, sv, nb (`no` directory), da, de, fr, es, nl, et, it and zh-CN (`zh-cn` directory). Each language was worked from en-GB, without treating the existing target-language WIP as an editorial source. The rejected Finnish Home copy was replaced in full before continuing with the other Finnish pages and languages.

For each language, the pass covers Home, The Villa, Lakeside Life, Spa & Wellness, Location, Private Services and The Villa, Documented. It includes the central translation bank, static localized HTML, page descriptions and the editorial sections outside the bank, including Serious Boating, Deep Roots, Private Winter Spa and Finnish Lakeland. The Private Winter Spa copy presents availability in winter 2026/27.

## Verification on a fresh checkout of the branch

- All six bank page key sets match en-GB across all 11 target languages.
- All 3,124 visible `data-i18n` fields checked in localized HTML match their corresponding bank entries; no mismatches.
- All 77 target-language pages in the seven-page scope are present. The Serious Boating, Deep Roots and Private Winter Spa sections are present for every language.
- Locked names, measurements, dates and distances were checked, including the 301.5 m² villa, 2,855 m² plot, four bedrooms, winter 2026/27, Syväri, Tahko, both approximately 100 m winter-route accesses, boating dimensions and 1,200 kg buoy anchor. Numeric typography follows target-language conventions where the numbers are localized.
- Editorial review compared localized passages against en-GB for naturalness, meaning, clarity, descriptive detail and facts, with a final Home polish pass in several languages.
- `python3 -m unittest discover -s tests -v`: three tests passed.

No merge to `main` is authorized or included in this checkpoint.
