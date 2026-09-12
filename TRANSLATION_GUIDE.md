# TLVS Translation Policy

## Canonical source
English (`en`) is the only source language. Other languages are derived from English.

## Supported languages
English (`en`), Finnish (`fi`), Swedish (`sv`), Norwegian Bokmål (`nb`, URL folder `/no/`), Danish (`da`), German (`de`), French (`fr`), Spanish (`es`), Dutch (`nl`), Estonian (`et`), Italian (`it`) and Simplified Chinese (`zh-CN`, URL folder `/zh-cn/`).

## Quality rule
Translate for a premium private-lakeside hospitality audience. Preserve meaning, restraint and editorial tone rather than translating word-for-word. Headings should stay concise enough to fit the approved layout.

## Locked names and terms
Do not translate: Lakeside Villa & Spa, Tahko, Kuopio, Siilinjärvi, Syväri, Tahkolahti, Lastukoski, Old Course, Lake & Forest.

For The Villa, Documented access UI, preserve these exact labels in every language: `Explore`, `Verified Property Access`, `Owner Access`.

## Future automation
When English copy changes:
1. Detect only changed source keys.
2. Translate only those changed keys.
3. Reuse approved translations for unchanged keys.
4. Keep locked terms unchanged.
5. Never expose API keys in browser JavaScript.
6. Cache approved/generated translations.
7. Allow important hero/brand copy to be manually locked.

## Crawlable language architecture
Every published language has its own static, crawlable HTML URL. Keep canonical and hreflang relationships consistent across the complete 12-language set and use English as `x-default` unless the production architecture is deliberately changed.

## Visual integrity
Translation updates must not change CSS, images, spacing, breakpoints, typography rules, or DOM layout. If a translation is too long, improve the translation rather than changing the approved design.
