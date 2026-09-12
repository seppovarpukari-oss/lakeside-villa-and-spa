/* Shared basic Consent Mode v2. No Google requests before analytics consent. */
(function () {
  'use strict';
  if (window.tlvsConsent) return;
  window.tlvsConsent = { initialized: true };
  const measurementId = 'G-BD1V798REN';
  const storageKey = 'tlvs-consent-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', denied);
  window.gtag('set', 'ads_data_redaction', true);
  let loaded = false;
  let choice = readChoice();

  function readChoice() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      if (value && value.version === 1 && typeof value.analytics === 'boolean' &&
          Number.isFinite(value.savedAt) && value.savedAt <= Date.now() && Date.now() - value.savedAt < maxAge) return value;
    } catch (_) { /* Storage may be disabled; fail closed. */ }
    return null;
  }

  function clearAnalyticsCookies() {
    const host = location.hostname.split('.');
    const domains = ['', ...host.map((_, i) => '.' + host.slice(i).join('.'))];
    const segments = location.pathname.split('/');
    const paths = ['/', ...segments.map((_, i) => segments.slice(0, i + 1).join('/') || '/')];
    document.cookie.split(';').forEach(function (cookie) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach(domain => paths.forEach(path => {
        document.cookie = name + '=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      }));
    });
  }

  function applyChoice() {
    const accepted = !!(choice && choice.analytics);
    window['ga-disable-' + measurementId] = !accepted;
    window.gtag('consent', 'update', Object.assign({}, denied, { analytics_storage: accepted ? 'granted' : 'denied' }));
    if (!accepted) { clearAnalyticsCookies(); return; }
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(script);
  }
  applyChoice();

  const translations = {
  "en": [
    "Cookie preferences",
    "With your permission, we use Google Analytics to understand how this website is used. Essential preferences are stored on your device. We do not use advertising cookies. You can change your choice at any time using Cookie preferences in the footer.",
    "Accept all",
    "Reject non-essential",
    "Close"
  ],
  "fi": [
    "Evästeasetukset",
    "Luvallasi käytämme Google Analyticsia sivuston käytön ymmärtämiseen. Välttämättömät asetukset tallennetaan laitteellesi. Emme käytä mainosevästeitä. Voit muuttaa valintaasi milloin tahansa alatunnisteen Evästeasetukset-linkistä.",
    "Hyväksy kaikki",
    "Hylkää ei-välttämättömät",
    "Sulje"
  ],
  "sv": [
    "Cookieinställningar",
    "Med ditt tillstånd använder vi Google Analytics för att förstå hur webbplatsen används. Nödvändiga inställningar sparas på din enhet. Vi använder inga reklamcookies. Du kan när som helst ändra ditt val via Cookieinställningar i sidfoten.",
    "Acceptera alla",
    "Avvisa icke-nödvändiga",
    "Stäng"
  ],
  "de": [
    "Cookie-Einstellungen",
    "Mit Ihrer Zustimmung verwenden wir Google Analytics, um die Nutzung dieser Website zu verstehen. Notwendige Einstellungen werden auf Ihrem Gerät gespeichert. Wir verwenden keine Werbe-Cookies. Sie können Ihre Auswahl jederzeit über Cookie-Einstellungen in der Fußzeile ändern.",
    "Alle akzeptieren",
    "Nicht notwendige ablehnen",
    "Schließen"
  ],
  "fr": [
    "Préférences des cookies",
    "Avec votre accord, nous utilisons Google Analytics pour comprendre l’utilisation du site. Les préférences essentielles sont enregistrées sur votre appareil. Nous n’utilisons pas de cookies publicitaires. Vous pouvez modifier votre choix à tout moment via Préférences des cookies en bas de page.",
    "Tout accepter",
    "Refuser les cookies non essentiels",
    "Fermer"
  ],
  "es": [
    "Preferencias de cookies",
    "Con tu permiso, utilizamos Google Analytics para comprender el uso de este sitio. Las preferencias esenciales se guardan en tu dispositivo. No utilizamos cookies publicitarias. Puedes cambiar tu elección en cualquier momento desde Preferencias de cookies al pie de página.",
    "Aceptar todas",
    "Rechazar las no esenciales",
    "Cerrar"
  ],
  "nl": [
    "Cookievoorkeuren",
    "Met uw toestemming gebruiken we Google Analytics om het gebruik van deze website te begrijpen. Noodzakelijke voorkeuren worden op uw apparaat opgeslagen. We gebruiken geen advertentiecookies. U kunt uw keuze altijd wijzigen via Cookievoorkeuren in de voettekst.",
    "Alles accepteren",
    "Niet-noodzakelijke weigeren",
    "Sluiten"
  ],
  "zh-cn": [
    "Cookie 偏好设置",
    "经您同意，我们使用 Google Analytics 了解本网站的使用情况。必要的偏好设置会保存在您的设备上。我们不使用广告 Cookie。您可以随时通过页脚的“Cookie 偏好设置”更改选择。",
    "全部接受",
    "拒绝非必要 Cookie",
    "关闭"
  ],
  "da": [
    "Cookieindstillinger",
    "Med din tilladelse bruger vi Google Analytics til at forstå, hvordan hjemmesiden bruges. Nødvendige indstillinger gemmes på din enhed. Vi bruger ikke reklamecookies. Du kan til enhver tid ændre dit valg via Cookieindstillinger i sidefoden.",
    "Acceptér alle",
    "Afvis ikke-nødvendige",
    "Luk"
  ],
  "nb": [
    "Informasjonskapsler",
    "Med din tillatelse bruker vi Google Analytics for å forstå hvordan nettstedet brukes. Nødvendige innstillinger lagres på enheten din. Vi bruker ikke informasjonskapsler for reklame. Du kan når som helst endre valget via Informasjonskapsler nederst på siden.",
    "Godta alle",
    "Avvis ikke-nødvendige",
    "Lukk"
  ],
  "et": [
    "Küpsiste eelistused",
    "Teie loal kasutame Google Analyticsit, et mõista veebisaidi kasutamist. Vajalikud eelistused salvestatakse teie seadmesse. Me ei kasuta reklaamiküpsiseid. Saate oma valikut igal ajal muuta jaluses oleva Küpsiste eelistused lingi kaudu.",
    "Nõustu kõigiga",
    "Keeldu mittevajalikest",
    "Sulge"
  ],
  "it": [
    "Preferenze cookie",
    "Con il tuo consenso utilizziamo Google Analytics per comprendere l’utilizzo del sito. Le preferenze essenziali vengono salvate sul tuo dispositivo. Non utilizziamo cookie pubblicitari. Puoi modificare la tua scelta in qualsiasi momento tramite Preferenze cookie nel piè di pagina.",
    "Accetta tutti",
    "Rifiuta i non essenziali",
    "Chiudi"
  ]
};
  function mount() {
    const t = translations[document.documentElement.lang.toLowerCase()] || translations.en;
    const panel = document.createElement('section');
    panel.id = 'tlvs-consent';
    panel.className = 'tlvs-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'tlvs-consent-title');
    panel.hidden = !!choice;
    const heading = document.createElement('h2');
    heading.id = 'tlvs-consent-title';
    heading.textContent = t[0];
    const description = document.createElement('p');
    description.textContent = t[1];
    panel.append(heading, description);
    const actions = document.createElement('div');
    actions.className = 'tlvs-consent-actions';
    let opener;
    function hide() {
      panel.hidden = true;
      if (opener) opener.focus();
    }
    function save(analytics) {
      choice = { version: 1, analytics: analytics, savedAt: Date.now() };
      try { localStorage.setItem(storageKey, JSON.stringify(choice)); } catch (_) { /* Keep this page's choice in memory. */ }
      applyChoice();
      hide();
    }
    function button(label, action, id) {
      const item = document.createElement('button');
      item.type = 'button';
      item.textContent = label;
      item.id = id;
      item.addEventListener('click', action);
      actions.appendChild(item);
      return item;
    }
    const accept = button(t[2], () => save(true), 'tlvs-consent-accept');
    button(t[3], () => save(false), 'tlvs-consent-reject');
    const close = button(t[4], hide, 'tlvs-consent-close');
    close.hidden = !choice;
    panel.appendChild(actions);
    document.body.appendChild(panel);
    function open(event) {
      event.preventDefault();
      opener = event.currentTarget;
      close.hidden = !choice;
      panel.hidden = false;
      accept.focus();
    }
    const links = document.querySelectorAll('footer [data-i18n="cookies"], footer a[href="#cookies"]');
    if (links.length) {
      links.forEach(link => {
        link.href = '#tlvs-consent';
        link.setAttribute('aria-controls', panel.id);
        link.textContent = t[0];
        link.addEventListener('click', open);
      });
    } else {
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'tlvs-consent-reopen';
      link.textContent = t[0];
      link.addEventListener('click', open);
      (document.querySelector('footer') || document.body).appendChild(link);
    }
    panel.addEventListener('keydown', event => {
      if (event.key === 'Escape' && choice) hide();
    });
    window.addEventListener('storage', event => {
      if (event.key !== storageKey && event.key !== null) return;
      choice = readChoice();
      applyChoice();
      panel.hidden = !!choice;
      close.hidden = !choice;
    });
    window.addEventListener('pageshow', event => {
      if (!event.persisted) return;
      choice = readChoice();
      applyChoice();
      panel.hidden = !!choice;
      close.hidden = !choice;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
}());

/* Shared loader for the locked Home Documented teaser. The teaser module itself decides whether the current URL is a Home page. */
(function(){
  const s=document.createElement('script');
  s.src='/assets/documented-teaser.js';
  s.defer=true;
  document.head.appendChild(s);
}());
