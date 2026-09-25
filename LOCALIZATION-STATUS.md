# TLVS Native Localization — Work Status

Branch: `native-localization-2026-09-25`
Locked starting HEAD: `e5db1a5a402a3673da11501af9f82bf13b74c044`
Editorial source: en-GB production copy
Authoritative workbook verified at project start: `Tahko_Lakeside_Villa_Spa_Master_rekisteri_v1_165.xlsx`
No merge to `main`.

## Current assessment — 2026-09-25

All 11 target languages (fi, sv, nb/no, da, de, fr, es, nl, et, it, zh-CN) have draft copy in the central translation bank and in the seven corresponding localized pages, including the Documented page and hardcoded editorial sections. FI Home was replaced rather than patched from the rejected WIP text.

**Native editorial approval remains open.** The earlier completion declaration was unsupported: passing fact tests and bank/HTML comparisons proves structural consistency, not idiomatic language or full preservation of en-GB meaning. A later manual pass found and corrected additional awkward or misleading text in every language it examined. The review was concentrated on longer bank entries; it is not a documented paragraph-by-paragraph native sign-off for every text field and hardcoded section.

The six bank pages contain 282 English keys, hence 3,102 target-language bank entries across 11 languages. In addition, each target-language set has 65 non-bank headings or paragraphs on the seven scoped pages (including repeated site elements). This scope requires a controlled full inventory, comparison with en-GB, and native-language editorial review before any release claim.

## Verified technical checks before the latest editorial changes

- Bank keys were identical to en-GB in every target language.
- 3,124 visible `data-i18n` fields in localized HTML matched the bank in a fresh checkout.
- The seven scoped pages and Serious Boating, Deep Roots and Private Winter Spa sections existed in every target language.
- Locked facts, number formatting and route distances were checked.
- Three repository unit tests passed.

These checks must be rerun after the latest edits. Do not describe this branch as native-editorially complete or merge it into `main` on the basis of the technical checks alone.
