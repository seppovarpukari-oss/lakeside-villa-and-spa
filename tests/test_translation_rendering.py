"""Catch entity encoding that makes localized calls to action render literally."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
LANGUAGES = ('fi', 'sv', 'no', 'da', 'de', 'fr', 'es', 'nl', 'et', 'it', 'zh-cn')
BANK_LANG = {'zh-cn': 'zh'}
CTA_KEYS = ('ctaVilla', 'ctaSpa', 'ctaExplore', 'ctaLocation', 'ctaServices')


class TranslationRenderingTest(unittest.TestCase):
    def test_home_ctas_render_a_single_angle_bracket(self):
        pages = json.loads((ROOT / 'assets/i18n/tlvs-translations.json').read_text())['pages']
        for directory in LANGUAGES:
            with self.subTest(language=directory):
                html = (ROOT / directory / 'index.html').read_text()
                self.assertNotIn('&amp;gt;', html)
                entries = pages['home'][BANK_LANG.get(directory, directory)]
                for key in CTA_KEYS:
                    self.assertTrue(entries[key].endswith('&gt;'), (directory, key))
                    self.assertNotIn('&amp;gt;', entries[key])


if __name__ == '__main__':
    unittest.main()
