// ===========================
// FAQ Accordion
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                } else {
                    question.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
});

// ===========================
// Contact Form to WhatsApp
// ===========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const goal = document.getElementById('goal').value;
        const level = document.getElementById('level').value;
        
        const goalTexts = {
            'comecar': 'Comecar a correr do zero',
            'melhorar': 'Melhorar meus tempos',
            'prova': 'Me preparar para uma prova',
            'saude': 'Correr com saude e consistencia',
            'outro': 'Outro objetivo'
        };
        
        const levelTexts = {
            'iniciante': 'Iniciante',
            'intermediario': 'Intermediario',
            'avancado': 'Avancado'
        };
        
        const message = `Ola, Karina! Meu nome e ${name}.

Vim pelo seu site e quero comecar uma assessoria de corrida.

Meu objetivo: ${goalTexts[goal]}
Meu nivel atual: ${levelTexts[level]}

Pode me explicar como funciona?`;
        
        const whatsappURL = `https://wa.me/5517996566908?text=${encodeURIComponent(message)}`;
        
        // Envia evento de lead para o Google Analytics
        if (typeof gtag === 'function') {
            gtag('event', 'conversion', {
                'send_to': 'G-J488T0R72B',
                'event_category': 'lead',
                'event_label': 'whatsapp_form',
                'value': 1.0,
                'custom_level': level,
                'custom_goal': goal
            });
        }
        
        window.open(whatsappURL, '_blank');
    });
}

// Smooth Scroll — tratado pela NAVBAR (com offset correto)

// ===========================
// Enhanced Lazy Loading
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// Scroll Animation for Sections
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
});

// ===========================
// WhatsApp Button Pulse Animation
// ===========================
const whatsappButton = document.querySelector('.whatsapp-float');
if (whatsappButton) {
    setInterval(() => {
        whatsappButton.style.animation = 'pulse 1s ease-in-out';
        setTimeout(() => {
            whatsappButton.style.animation = '';
        }, 1000);
    }, 5000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// ===========================
// Carrossel de Feedbacks com Swipe
// ===========================
// ===========================
// Carrossel com Swipe (Genérico)
// ===========================
(function() {
    console.log('[CAROUSEL] Iniciando com suporte a swipe para múltiplos carrosséis...');
    
    function initCarousel(carouselClass) {
        var carouselEl = document.querySelector(carouselClass);
        if (!carouselEl) {
            console.log('[CAROUSEL] Carrossel nao encontrado:', carouselClass);
            return;
        }
        
        var track = carouselEl.querySelector('.carousel-track');
        var slides = carouselEl.querySelectorAll('.carousel-slide');
        var prevBtn = carouselEl.querySelector('.carousel-btn.prev');
        var nextBtn = carouselEl.querySelector('.carousel-btn.next');
        var indicators = carouselEl.querySelector('.carousel-indicators');
        
        if (!track || slides.length === 0) {
            console.log('[CAROUSEL] Elementos do carrossel nao encontrados para:', carouselClass);
            return;
        }
        
        console.log('[CAROUSEL] Encontrados ' + slides.length + ' slides em:', carouselClass);
        
        var currentPage = 0;
        var slidesPerView = 3;
        
        // Variáveis para controle de swipe/drag
        var startX = 0;
        var currentX = 0;
        var isDragging = false;
        var hasMoved = false;
        var touchStartTime = 0;
        var clickedImage = null;
        
        function updateSlidesPerView() {
            var w = window.innerWidth;
            slidesPerView = w <= 640 ? 1 : w <= 968 ? 2 : 3;
        }
        
        function getTotalPages() {
            return Math.ceil(slides.length / slidesPerView);
        }
        
        function createDots() {
            if (!indicators) return;
            indicators.innerHTML = '';
            var total = getTotalPages();
            for (var i = 0; i < total; i++) {
                var dot = document.createElement('button');
                dot.className = 'indicator';
                dot.setAttribute('data-page', i);
                dot.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
                
                (function(page, btn) {
                    var dotTouched = false;
                    btn.addEventListener('touchstart', function(e) {
                        e.stopPropagation(); // não deixa o track capturar
                        dotTouched = true;
                        goToPage(page);
                    }, { passive: true });
                    btn.addEventListener('click', function(e) {
                        if (dotTouched) { dotTouched = false; return; } // evita duplo disparo
                        goToPage(page);
                    });
                })(i, dot);
                indicators.appendChild(dot);
            }
        }
        
        function update() {
            var total = getTotalPages();
            currentPage = Math.max(0, Math.min(currentPage, total - 1));
            var move = -currentPage * 100;
            track.style.transform = 'translateX(' + move + '%)';
            
            var dots = indicators ? indicators.querySelectorAll('.indicator') : [];
            for (var i = 0; i < dots.length; i++) {
                dots[i].className = i === currentPage ? 'indicator active' : 'indicator';
            }
        }
        
        function goToPage(page) {
            currentPage = page;
            update();
        }
        
        function goNext() {
            currentPage = (currentPage + 1) % getTotalPages();
            update();
        }
        
        function goPrev() {
            var total = getTotalPages();
            currentPage = (currentPage - 1 + total) % total;
            update();
        }
        
        function getPositionX(event) {
            return event.type.indexOf('mouse') !== -1 ? event.pageX : event.touches[0].clientX;
        }
        
        function touchStart(event) {
            startX = getPositionX(event);
            isDragging = true;
            hasMoved = false;
            touchStartTime = Date.now();
            
            var target = event.target;
            if (target.tagName === 'IMG') {
                clickedImage = target;
            } else if (target.querySelector && target.querySelector('img')) {
                clickedImage = target.querySelector('img');
            } else {
                clickedImage = null;
            }
            
            track.style.transition = 'none';
        }
        
        function touchMove(event) {
            if (!isDragging) return;
            
            currentX = getPositionX(event);
            var diffX = currentX - startX;
            
            if (Math.abs(diffX) > 5) {
                hasMoved = true;
            }
            
            var currentTranslate = -currentPage * 100;
            var trackWidth = track.offsetWidth;
            var movePercent = (diffX / trackWidth) * 100;
            
            track.style.transform = 'translateX(' + (currentTranslate + movePercent) + '%)';
        }
        
        function touchEnd(event) {
            if (!isDragging) return;
            
            isDragging = false;
            track.style.transition = 'transform 0.5s ease';
            
            var diffX = currentX - startX;
            var threshold = 50;
            var touchDuration = Date.now() - touchStartTime;
            
            if (!hasMoved && touchDuration < 300 && clickedImage) {
                update();
                console.log('[CAROUSEL] Clique rápido em imagem - abrindo lightbox');
                
                var lightbox = document.getElementById('feedbackLightbox');
                var lightboxImg = document.getElementById('lightboxImage') || document.getElementById('lightboxImg');
                
                if (lightbox && lightboxImg && clickedImage) {
                    lightboxImg.src = clickedImage.src;
                    lightbox.className = 'lightbox active';
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                }
                
                return;
            }
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    goPrev();
                } else {
                    goNext();
                }
            } else {
                update();
            }
        }
        
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchmove', touchMove, { passive: true });
        track.addEventListener('touchend', touchEnd);
        
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', function() {
            if (isDragging) {
                touchEnd();
            }
        });
        
        track.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
        
        if (prevBtn) prevBtn.onclick = goPrev;
        if (nextBtn) nextBtn.onclick = goNext;
        
        updateSlidesPerView();
        createDots();
        update();
        
        window.addEventListener('resize', function() {
            updateSlidesPerView();
            createDots();
            update();
        });
    }
    
    function initAll() {
        initCarousel('.feedbacks-carousel');
        initCarousel('.results-carousel');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();

// ===========================
// Lightbox
// ===========================
(function() {
    console.log('[LIGHTBOX] Iniciando...');
    
    function init() {
        var lightbox = document.getElementById('feedbackLightbox');
        var lightboxImg = document.getElementById('lightboxImage') || document.getElementById('lightboxImg');
        
        if (!lightbox || !lightboxImg) {
            console.log('[LIGHTBOX] Elementos nao encontrados');
            return;
        }
        
        var images = document.querySelectorAll('.feedback-card img, .result-card img');
        console.log('[LIGHTBOX] Encontradas ' + images.length + ' imagens amplíaveis');
        
        function openLightbox(src) {
            if (lightbox && lightboxImg && src) {
                lightboxImg.src = src;
                lightbox.className = 'lightbox active';
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                console.log('[LIGHTBOX] Aberto:', src);
            }
        }

        // Adiciona cursor pointer, previne drag e adiciona evento de clique direto
        for (var i = 0; i < images.length; i++) {
            images[i].style.cursor = 'pointer';
            
            images[i].addEventListener('dragstart', function(e) {
                e.preventDefault();
            });

            (function(imgElement) {
                imgElement.addEventListener('click', function(e) {
                    openLightbox(imgElement.src);
                });
            })(images[i]);
        }
        
        function close() {
            lightbox.className = 'lightbox';
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            console.log('[LIGHTBOX] Fechado');
        }
        
        var closeBtn = lightbox.querySelector('.lightbox-close');
        var overlay = lightbox.querySelector('.lightbox-overlay');
        
        if (closeBtn) closeBtn.onclick = close;
        if (overlay) overlay.onclick = close;
 
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                close();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.className.indexOf('active') >= 0) {
                close();
            }
        });
        
        console.log('[LIGHTBOX] Inicializado com sucesso!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
