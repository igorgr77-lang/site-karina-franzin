// ============================================
// ANALYTICS (Google Analytics 4 + Microsoft Clarity)
// Fica num arquivo próprio para a página não precisar de <script> inline,
// o que permite uma Content-Security-Policy sem 'unsafe-inline'.
// ============================================
(function () {
    var GA_ID = 'G-J488T0R72B';
    var CLARITY_ID = 'y8pg4kcmrc';

    function loadScript(src) {
        var s = document.createElement('script');
        s.async = true;
        s.src = src;
        document.head.appendChild(s);
    }

    // Google Analytics
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID);

    // Microsoft Clarity
    window.clarity = window.clarity || function () {
        (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    loadScript('https://www.clarity.ms/tag/' + CLARITY_ID);

    // CSS não bloqueante: <link rel="stylesheet" media="print" data-async-css>
    // (substitui o antigo onload="this.media='all'")
    function enableAsyncCss() {
        var links = document.querySelectorAll('link[data-async-css]');
        for (var i = 0; i < links.length; i++) links[i].media = 'all';
    }
    enableAsyncCss();
    document.addEventListener('DOMContentLoaded', enableAsyncCss);
})();
