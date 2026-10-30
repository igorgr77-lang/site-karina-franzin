// Registra o Service Worker (cache de assets). Antes ficava inline na home.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function (err) {
            console.log('SW registration failed: ', err);
        });
    });
}
