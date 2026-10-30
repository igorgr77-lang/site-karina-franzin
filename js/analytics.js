// ============================================
// ANALYTICS + CONSENTIMENTO DE COOKIES (LGPD)
// - Google Analytics 4 com Consent Mode v2: antes do aceite, o GA só recebe
//   sinais anônimos, sem cookies (analytics_storage = denied).
// - Microsoft Clarity (gravação de sessão) só carrega depois do aceite.
// - A escolha fica salva no navegador; o link "Preferências de cookies"
//   (data-cookie-prefs) reabre o banner.
// Fica num arquivo próprio para a página não precisar de <script> inline,
// o que permite uma Content-Security-Policy sem 'unsafe-inline'.
// ============================================
(function () {
    var GA_ID = 'G-J488T0R72B';
    var CLARITY_ID = 'y8pg4kcmrc';
    var STORAGE_KEY = 'kf_cookie_consent_v1';
    var PRIVACY_URL = '/planos/privacidade.html#cookies';

    function loadScript(src) {
        var s = document.createElement('script');
        s.async = true;
        s.src = src;
        document.head.appendChild(s);
    }

    function readConsent() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function saveConsent(value) {
        try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* navegação privada */ }
    }

    // ---------- Google Analytics (Consent Mode v2) ----------
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    var consent = readConsent();
    window.gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: consent === 'granted' ? 'granted' : 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);

    // ---------- Microsoft Clarity (só com aceite) ----------
    var clarityLoaded = false;
    function loadClarity() {
        if (clarityLoaded) return;
        clarityLoaded = true;
        window.clarity = window.clarity || function () {
            (window.clarity.q = window.clarity.q || []).push(arguments);
        };
        window.clarity('consent');
        loadScript('https://www.clarity.ms/tag/' + CLARITY_ID);
    }
    if (consent === 'granted') loadClarity();

    // Apaga cookies de análise já gravados (ao recusar depois de ter aceitado)
    function clearAnalyticsCookies() {
        var host = location.hostname.replace(/^www\./, '');
        document.cookie.split(';').forEach(function (c) {
            var name = c.split('=')[0].trim();
            if (/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID|ANONCHK|SM)/.test(name)) {
                ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
                    document.cookie = name + '=; Max-Age=0; path=/' + d;
                });
            }
        });
    }

    function applyChoice(value) {
        var previous = readConsent();
        saveConsent(value);
        window.gtag('consent', 'update', { analytics_storage: value });
        if (value === 'granted') {
            loadClarity();
        } else {
            clearAnalyticsCookies();
            // O Clarity não tem como ser desligado sem recarregar a página
            if (previous === 'granted' && clarityLoaded) location.reload();
        }
        hideBanner();
    }

    // ---------- Banner ----------
    var banner = null;

    function injectStyles() {
        if (document.getElementById('kf-cookie-style')) return;
        var css =
            '.kf-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:720px;margin:0 auto;' +
            'background:#151515;color:#f2f2f2;border:1px solid #333;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.35);' +
            'padding:18px 20px;font:14px/1.5 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:flex;gap:16px;align-items:center;flex-wrap:wrap}' +
            '.kf-cookie p{margin:0;flex:1 1 320px}' +
            '.kf-cookie a{color:#FF8A5C;text-decoration:underline}' +
            '.kf-cookie-actions{display:flex;gap:10px;flex:0 0 auto}' +
            '.kf-cookie button{font:600 14px/1 Inter,system-ui,sans-serif;padding:12px 18px;border-radius:10px;cursor:pointer;min-width:110px;border:1px solid #FF6B35}' +
            '.kf-cookie .kf-accept{background:#FF6B35;color:#fff}' +
            '.kf-cookie .kf-reject{background:transparent;color:#fff}' +
            '.kf-cookie button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
            '@media (max-width:520px){.kf-cookie{left:12px;right:12px;bottom:12px;padding:16px}.kf-cookie-actions{width:100%}.kf-cookie button{flex:1}}';
        var style = document.createElement('style');
        style.id = 'kf-cookie-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function showBanner() {
        if (banner) { banner.hidden = false; return; }
        injectStyles();
        banner = document.createElement('div');
        banner.className = 'kf-cookie';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Consentimento de cookies');

        var text = document.createElement('p');
        text.appendChild(document.createTextNode(
            'Usamos cookies de análise (Google Analytics e Microsoft Clarity) para entender como o site é usado e melhorá-lo. Você pode aceitar ou recusar. '));
        var link = document.createElement('a');
        link.href = PRIVACY_URL;
        link.textContent = 'Política de Privacidade';
        text.appendChild(link);
        text.appendChild(document.createTextNode('.'));

        var actions = document.createElement('div');
        actions.className = 'kf-cookie-actions';
        var reject = document.createElement('button');
        reject.type = 'button';
        reject.className = 'kf-reject';
        reject.textContent = 'Recusar';
        reject.addEventListener('click', function () { applyChoice('denied'); });
        var accept = document.createElement('button');
        accept.type = 'button';
        accept.className = 'kf-accept';
        accept.textContent = 'Aceitar';
        accept.addEventListener('click', function () { applyChoice('granted'); });
        actions.appendChild(reject);
        actions.appendChild(accept);

        banner.appendChild(text);
        banner.appendChild(actions);
        document.body.appendChild(banner);
    }

    function hideBanner() {
        if (banner) banner.hidden = true;
    }

    // Link "Preferências de cookies" (rodapé): reabre o banner
    document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('[data-cookie-prefs]');
        if (!el) return;
        e.preventDefault();
        showBanner();
    });

    // CSS não bloqueante: <link rel="stylesheet" media="print" data-async-css>
    function enableAsyncCss() {
        var links = document.querySelectorAll('link[data-async-css]');
        for (var i = 0; i < links.length; i++) links[i].media = 'all';
    }
    enableAsyncCss();

    function onReady() {
        enableAsyncCss();
        if (consent !== 'granted' && consent !== 'denied') showBanner();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }
})();
