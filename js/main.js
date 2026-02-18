// ===========================
// FAQ Accordion
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
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
        
        window.open(whatsappURL, '_blank');
    });
}

// ===========================
// Smooth Scroll Enhancement
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

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
// Carrossel de Feedbacks
// ===========================
(function() {
    console.log('[CAROUSEL] Iniciando...');
    
    function init() {
        var track = document.querySelector('.carousel-track');
        var slides = document.querySelectorAll('.carousel-slide');
        var prevBtn = document.querySelector('.carousel-btn.prev');
        var nextBtn = document.querySelector('.carousel-btn.next');
        var indicators = document.querySelector('.carousel-indicators');
        
        if (!track || slides.length === 0) {
            console.log('[CAROUSEL] Elementos nao encontrados');
            return;
        }
        
        console.log('[CAROUSEL] Encontrados ' + slides.length + ' slides');
        
        var currentPage = 0;
        var slidesPerView = 3;
        
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
                dot.onclick = (function(page) {
                    return function() { goToPage(page); };
                })(i);
                indicators.appendChild(dot);
            }
            console.log('[CAROUSEL] Criados ' + total + ' dots');
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
        
        if (prevBtn) prevBtn.onclick = goPrev;
        if (nextBtn) nextBtn.onclick = goNext;
        
        updateSlidesPerView();
        createDots();
        update();
        
        console.log('[CAROUSEL] Inicializado com sucesso!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ===========================
// Lightbox
// ===========================
(function() {
    console.log('[LIGHTBOX] Iniciando...');
    
    function init() {
        var lightbox = document.getElementById('feedbackLightbox');
        var lightboxImg = document.getElementById('lightboxImage');
        
        if (!lightbox || !lightboxImg) {
            console.log('[LIGHTBOX] Elementos nao encontrados');
            return;
        }
        
        var images = document.querySelectorAll('.feedback-card img');
        console.log('[LIGHTBOX] Encontradas ' + images.length + ' imagens');
        
        for (var i = 0; i < images.length; i++) {
            images[i].style.cursor = 'pointer';
            images[i].onclick = (function(img) {
                return function() {
                    lightboxImg.src = img.src;
                    lightbox.className = 'lightbox active';
                    document.body.style.overflow = 'hidden';
                };
            })(images[i]);
        }
        
        function close() {
            lightbox.className = 'lightbox';
            document.body.style.overflow = '';
        }
        
        var closeBtn = lightbox.querySelector('.lightbox-close');
        var overlay = lightbox.querySelector('.lightbox-overlay');
        
        if (closeBtn) closeBtn.onclick = close;
        if (overlay) overlay.onclick = close;
        
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
