# TLVS Native Localization — Work Status

Branch: native-localization-2026-09-25
Base used for this work: main at 65f3f6c3684958599ee1921522dbc474e2c4d94e
Production main has NOT been intentionally merged with this WIP localization.

## Current status
This entire localization pass is WIP and NOT approved.

### 2026-09-25 checkpoint
- Locked source HEAD: `e5db1a5a402a3673da11501af9f82bf13b74c044`.
- Library authoritative workbook verified readable: `Tahko_Lakeside_Villa_Spa_Master_rekisteri_v1_165.xlsx`.
- FI Home was rewritten from the English editorial source, with HTML and translation bank updated.
- Long-form FI copy on The Villa, Lakeside Life, Spa & Wellness, Location and Private Services was rewritten from English; the Documented and hardcoded editorial sections were also revised. This is a work checkpoint, not final native editorial sign-off. Short labels, metadata, and complete semantic and fact QA remain open.
- Other ten target languages have not been rewritten in this checkpoint. Existing WIP must not be treated as approved.
- The repository's three `tests/test_fact_languages.py` tests passed locally after the FI edits.
- No merge to `main`.

The following pages have been edited across all 11 target languages to varying degrees:
- Home
- The Villa
- Lakeside Life
- Spa & Wellness
- Location
- Private Services
- The Villa, Documented

However, the current pass must NOT be considered language-complete.

## Critical finding
Finnish still contains unnatural editorial language and proves that the process needs a stricter native-language QA before release.

Rejected example from current FI Home:
"Sisäallas ja spa ovat käytössä ympäri vuoden, ja terassit, oma laituri ja järvi kuuluvat kaikki huvilalla vietettyyn aikaan. Siksi itse huvila ja sen rantaympäristö ovat osa lomaa, eivät vain tukikohta, josta lähdetään muualle."

Why rejected:
- "kuuluvat kaikki huvilalla vietettyyn aikaan" is not natural Finnish
- "itse huvila ja sen rantaympäristö ovat osa lomaa" reads as constructed translation/copy, not native Finnish
- the sentence mirrors the English conceptual structure too closely instead of expressing the same meaning naturally in Finnish

## Correct working method from next session
- Read the whole en-GB paragraph/section first.
- Identify what it is actually saying in ordinary human terms.
- Close the English mentally and write the target-language paragraph naturally.
- Then back-check that no substantive idea was lost.
- No sentence-count target. Four or five sentences are fine if that is clearer.
- Never use FI as the source for other languages; all languages are independently written from en-GB.
- Do not continue to the next page/language batch until the current native-language text passes the native read.

## First action in next session
Start by repairing FI Home using the editorial rule in LOCALIZATION-GUIDE.md.
Do not merely patch the rejected sentence. Re-read the full English Home page and rewrite the Finnish Home copy as natural Finnish while preserving the entire meaning.
Then apply the same native editorial QA discipline to all 10 other languages and all pages.

## Structural notes
- assets/i18n/tlvs-translations.json is a central translation bank.
- Static localized HTML files also contain visible copy, so bank and HTML must stay in sync.
- Some sections are hardcoded outside the translation bank, including Serious Boating, Deep Roots, Winter Spa and Documented content.
- Preserve translation-bank parity work already completed.
- Do not merge to main until native editorial QA + meaning/fact QA + repo tests all pass.
