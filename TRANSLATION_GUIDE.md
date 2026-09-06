# TLVS Translation Policy

## Canonical source
English (`en`) is the only source language. Other languages are derived from English.

## Supported languages
English, Finnish, Swedish, German, French, Spanish, Dutch and Simplified Chinese.

## Quality rule
Translate for a premium private-lakeside hospitality audience. Preserve meaning, restraint and editorial tone rather than translating word-for-word. Headings should stay concise enough to fit the approved layout.

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
