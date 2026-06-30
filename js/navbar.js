// ============================================
// NAVBAR SYSTEM (COMPARTILHADO E ACESSÍVEL)
// ============================================
(function () {
    function initNavbar() {
        var navbar    = document.getElementById('navbar');
        var toggle    = document.getElementById('navbarToggle');
        var links     = document.getElementById('navbarLinks');
        var overlay   = document.getElementById('navbarOverlay');
        var navLinks  = document.querySelectorAll('.nav-link:not(.nav-cta)');

        if (!navbar || !toggle || !links) return;

        // ── Detecta WebView do Instagram/Facebook e força navbar escura ──
        var ua = navigator.userAgent || '';
        var isWebView = /Instagram|FBAN|FBAV|FB_IAB|LinkedInApp|Twitter|TikTok/i.test(ua);

        // Referrer (quando abre no browser externo vindo de redes sociais)
        var ref = document.referrer || '';
        var isFromInstagram = /instagram\.com|facebook\.com|fb\.com/i.test(ref);

        // Parâmetros de URL do Instagram
        var urlParams = window.location.search || '';
        var hasInstaParams = /igshid|utm_source=ig_web|utm_medium=copy_link/i.test(urlParams);

        if (isWebView || isFromInstagram || hasInstaParams) {
            navbar.classList.add('navbar-webview');
            navbar.classList.add('navbar-scrolled'); // força escuro sempre no WebView
            document.body.classList.add('is-webview'); // ajusta espaçamento do hero
        }

        // ── Abrir / Fechar menu mobile ──
        function openMenu() {
            links.classList.add('open');
            toggle.classList.add('open');
            if (overlay) overlay.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            links.classList.remove('open');
            toggle.classList.remove('open');
            if (overlay) overlay.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Click listener unificado (sem conflitos de touchstart/click em navegadores móveis)
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            var isOpen = links.classList.contains('open');
            isOpen ? closeMenu() : openMenu();
        });

        if (overlay) {
            overlay.addEventListener('click', function (e) {
                e.preventDefault();
                closeMenu();
            });
        }

        // Fechar ao clicar em link interno (âncoras na mesma página ou com delay para externos)
        links.querySelectorAll('a[href*="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var href = this.getAttribute('href') || '';
                var isCurrentPageAnchor = href.startsWith('#');
                var isHomeAnchor = href.startsWith('/#') && (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '');
                
                if (isCurrentPageAnchor || isHomeAnchor) {
                    closeMenu();
                } else {
                    // Para links externos/outras páginas, fecha o menu com um pequeno delay para não abortar a navegação no Chrome/Safari mobile
                    setTimeout(closeMenu, 150);
                }
            });
        });

        // ── Escurecer navbar ao rolar (somente na Home) ──
        // Para identificar se estamos na Home, verificamos se a navbar tem a classe "navbar-transparent"
        var isHomepage = navbar.classList.contains('navbar-transparent') || !navbar.classList.contains('navbar-scrolled');

        function getScrollY() {
            return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        }

        function updateNavbar() {
            // Se for WebView/Instagram, a navbar já fica sempre escura
            if (isWebView || isFromInstagram || hasInstaParams) {
                navbar.classList.add('navbar-scrolled');
                return;
            }
            
            if (isHomepage) {
                if (getScrollY() > 40) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            } else {
                // Fora da Home, ela está sempre escura
                navbar.classList.add('navbar-scrolled');
            }
        }
        
        window.addEventListener('scroll', updateNavbar, { passive: true });
        document.addEventListener('touchmove', updateNavbar, { passive: true });
        updateNavbar(); // Roda imediatamente

        // ── Highlight do link ativo da página atual (Blog, Eventos, Cupons) ──
        function normalizePath(p) {
            return p.replace(/\/+$/, '') || '/';
        }
        var normPath = normalizePath(window.location.pathname);
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var normHref = normalizePath(href.split('#')[0]); // ignora partes de âncora/hash
            
            if (!isHomepage) {
                link.classList.remove('active');
            }
            if (href !== '/' && href !== '/index.html' && !href.startsWith('/#')) {
                if (normPath === normHref || (normHref !== '/' && normPath.startsWith(normHref))) {
                    link.classList.add('active');
                }
            }
        });

        // ── Highlight do link ativo conforme seção visível (apenas na Home) ──
        if (isHomepage) {
            var sections = document.querySelectorAll('section[id]');

            function highlightNav() {
                var scrollY  = window.scrollY + 90;
                var found    = false;

                sections.forEach(function (sec) {
                    var top    = sec.offsetTop;
                    var height = sec.offsetHeight;
                    var id     = sec.getAttribute('id');
                    var link   = links.querySelector('a[href$="#' + id + '"]'); // seletor flexível para âncoras
                    if (!link) return;

                    if (scrollY >= top && scrollY < top + height) {
                        navLinks.forEach(function (l) { 
                            var href = l.getAttribute('href') || '';
                            if (href.includes('#')) {
                                l.classList.remove('active'); 
                            }
                        });
                        link.classList.add('active');
                        found = true;
                    }
                });

                if (!found) {
                    navLinks.forEach(function (l) { 
                        var href = l.getAttribute('href') || '';
                        if (href.includes('#')) {
                            l.classList.remove('active'); 
                        }
                    });
                }
            }

            window.addEventListener('scroll', highlightNav, { passive: true });
            highlightNav();
        }

        // ── Smooth scroll com offset da navbar (links internos) ──
        document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                var isExternalAnchor = href.includes('#') && !href.startsWith('#');
                var isCurrentPageAnchor = href.startsWith('#');
                
                if (isCurrentPageAnchor) {
                    var target = document.querySelector(href);
                    if (!target || href === '#') return;
                    e.preventDefault();
                    var offset = navbar.offsetHeight + 8;
                    var top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                } else if (isExternalAnchor && (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname === '')) {
                    // Se estamos na Home e clicamos em /#sobre, trata como âncora interna
                    var anchorId = href.split('#')[1];
                    var target = document.getElementById(anchorId);
                    if (target) {
                        e.preventDefault();
                        var offset = navbar.offsetHeight + 8;
                        var top = target.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();
