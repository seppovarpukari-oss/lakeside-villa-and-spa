"""Check all localized fact sections without installing dependencies."""
from html.parser import HTMLParser
from pathlib import Path
import sys
import re

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ('en', 'fi', 'sv', 'no', 'da', 'de', 'fr', 'es', 'nl', 'et', 'it', 'zh-cn')
# These short terms are also valid in the corresponding translations.
SHARED = {
    'sv': {'Villa', 'Wellness', 'Pool', 'Transport'},
    'no': {'Villa', 'Transport'},
    'da': {'Villa', 'Wellness', 'Pool', 'Transport'},
    'de': {'Villa', 'Wellness', 'Pool', 'Transport', 'Housekeeping'},
    'fr': {'Villa', 'Transport'},
    'es': {'Villa'},
    'nl': {'Villa', 'Wellness', 'Spa & wellness'},
    'et': {'Villa', 'Transport'},
    'it': {'Villa'},
}
LOCKED = {'Tahko', 'Old Course', 'Siilinjärvi', 'Kuopio', 'Private Winter Spa'}
for _language in LANGUAGES:
    if _language not in ('en', 'zh-cn'):
        SHARED.setdefault(_language, set()).add('Golf')
SHARED['nl'].add('Direct')


class Facts(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.lang = None
        self.sections = {}
        self.item_text_counts = {}
        self.current = None
        self.current_item = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html':
            self.lang = attrs.get('lang', '').lower()
        if tag == 'section' and {'p0098-facts', 'glance'} & set(attrs.get('class', '').split()):
            self.current = attrs.get('id')
            assert self.current and self.current not in self.sections, 'Missing or duplicate fact section ID'
            self.sections[self.current] = []
            self.item_text_counts[self.current] = []
        if self.current and tag == 'div' and {'p0098-item', 'stat'} & set(attrs.get('class', '').split()):
            self.item_text_counts[self.current].append(0)
            self.current_item = len(self.item_text_counts[self.current]) - 1

    def handle_endtag(self, tag):
        if tag == 'div' and self.current_item is not None:
            self.current_item = None
        if tag == 'section':
            self.current = None
            self.current_item = None

    def handle_data(self, data):
        text = ' '.join(data.split())
        if self.current and text:
            self.sections[self.current].append(text)
            if self.current_item is not None:
                self.item_text_counts[self.current][self.current_item] += 1


def check(root=ROOT):
    errors = []
    count = 0
    for source in sorted(root.glob('*.html')):
        english = Facts(source.read_text())
        if not english.sections:
            continue
        for lang in LANGUAGES:
            path = source if lang == 'en' else root / lang / source.name
            if not path.exists():
                errors.append(f'{lang}/{source.name}: missing page')
                continue
            localized = Facts(path.read_text())
            if localized.lang != {'no': 'nb'}.get(lang, lang):
                errors.append(f'{path.relative_to(root)}: incorrect HTML language {localized.lang}')
            if localized.sections.keys() != english.sections.keys():
                errors.append(f'{path.relative_to(root)}: missing or extra fact sections')
            for section, original in english.sections.items():
                translated = localized.sections.get(section, [])
                localized_items = localized.item_text_counts.get(section, [])
                if not localized_items:
                    errors.append(f'{path.relative_to(root)}#{section}: no fact items found')
                for item_index, text_count in enumerate(localized_items, 1):
                    if text_count < 2:
                        errors.append(
                            f'{path.relative_to(root)}#{section}: fact item {item_index} has too little text content'
                        )
                if lang != 'en':
                    for text in translated:
                        measurement = re.fullmatch(r'[~≈]?\s*[\d.,]+\s*(?:m|km|m²)', text)
                        if text in original and text not in SHARED.get(lang, set()) | LOCKED and not measurement and any(c.isalpha() for c in text):
                            errors.append(f'{path.relative_to(root)}#{section}: untranslated English: {text}')
                count += 1
    if not count:
        errors.append('No fact sections found')
    return count, errors


if __name__ == '__main__':
    count, errors = check()
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        sys.exit(1)
    print(f'PASS: {count} fact sections across {len(LANGUAGES)} languages')
