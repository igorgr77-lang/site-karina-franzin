// Service Worker para cache estratégico
const CACHE_NAME = 'karina-franzin-v1';
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/assets/img/karina-hero.jpg',
    '/assets/icons/WhatsApp.svg.webp'
];

// Cache assets críticos na instalação
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(CRITICAL_ASSETS);
            })
    );
    self.skipWaiting();
});

// Limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estratégia cache-first para assets estáticos
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    // Cache first para assets estáticos
    if (event.request.url.includes('.css') || 
        event.request.url.includes('.js') ||
        event.request.url.includes('.jpg') ||
        event.request.url.includes('.png') ||
        event.request.url.includes('.webp') ||
        event.request.url.includes('/assets/')) {
        
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then((response) => {
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return response;
                    });
                })
        );
    }
    // Network first para HTML e outras requests
    else {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }
});