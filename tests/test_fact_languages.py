"""Regression tests for the language checker and the location-grid repair."""
import json
import re
import shutil
import tempfile
import unittest
from pathlib import Path

from fact_languages import ROOT, LANGUAGES, Facts, check


class FactLanguagesTest(unittest.TestCase):
    def test_all_fact_sections(self):
        count, errors = check()
        self.assertEqual([], errors)
        self.assertGreaterEqual(count, 72)

    def test_location_inventory_and_distances(self):
        inventory = json.loads((ROOT / 'assets/i18n/tlvs-translations.json').read_text())['pages']['location']
        for lang in LANGUAGES:
            path = ROOT / ('location.html' if lang == 'en' else f'{lang}/location.html')
            html = path.read_text()
            grid = re.search(r'<div class="glance-grid">.*?</section>', html)[0]
            values = re.findall(r'data-i18n="(distance[^"]+)">([^<]+)<', grid)
            self.assertEqual(11, len(values), lang)
            for key, value in values:
                self.assertEqual(value, inventory['zh' if lang == 'zh-cn' else lang][key])
            distances = re.findall(r'<strong>~([\d.,]+) (m|km)</strong>', grid)
            self.assertEqual([('100', 'm'), ('100', 'm'), ('1.5', 'km'), ('1.7', 'km'), ('0.8', 'km'), ('40', 'km'), ('55', 'km')],
                             [(n.replace(',', '.'), unit) for n, unit in distances], lang)
            self.assertEqual(7, grid.count('class="stat"'), lang)

    def test_checker_rejects_actual_regression_and_missing_content(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for lang in LANGUAGES:
                relative = Path('location.html' if lang == 'en' else f'{lang}/location.html')
                (root / relative).parent.mkdir(parents=True, exist_ok=True)
                shutil.copy(ROOT / relative, root / relative)
            self.assertEqual([], check(root)[1])
            path = root / 'fi/location.html'
            original = path.read_text()
            path.write_text(original.replace('Hiihtolatu', 'XC ski trail'))
            self.assertTrue(any('untranslated English: XC ski trail' in e for e in check(root)[1]))
            path.write_text(original.replace('section-block glance', 'section-block'))
            self.assertTrue(any('missing or extra fact sections' in e for e in check(root)[1]))
            path.unlink()
            self.assertTrue(any('missing page' in e for e in check(root)[1]))


if __name__ == '__main__':
    unittest.main()
