# Lakeside Villa & Spa — GitHub Pages QA site

This folder is the test-site package for GitHub Pages.

## Pages
- `index.html` — Home
- `the-villa.html`
- `lakeside-life.html`
- `spa-wellness.html`
- `location.html`
- `private-services.html`

## GitHub Pages setup (free)
1. Create a **public** repository in GitHub.
2. Upload the **contents of this folder** to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Branch: `main`, folder: `/ (root)`, then **Save**.
6. GitHub will show the live `github.io` URL when deployment is ready.

The site uses relative page links, so navigation works both locally and on GitHub Pages.
Language choice is stored in the browser (`localStorage`) and persists between pages on the same GitHub Pages origin.

## Custom domain
Do not add the production domain during early device QA. After approval, configure the owned Lakeside Villa & Spa domain in **Settings → Pages → Custom domain**, then update DNS at the domain registrar and enable HTTPS.


## Languages
This package includes canonical translations for EN, FI, SV, DE, FR, ES, NL and Simplified Chinese. The translation bank is in `assets/i18n/tlvs-translations.json`; translation policy is in `TRANSLATION_GUIDE.md`.
