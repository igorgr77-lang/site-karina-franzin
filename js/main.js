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
// Carrossel de Feedbacks com Swipe
// ===========================
(function() {
    console.log('[CAROUSEL] Iniciando com suporte a swipe...');
    
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
        
        // ===========================
        // SWIPE/TOUCH FUNCTIONALITY
        // ===========================
        
        function getPositionX(event) {
            return event.type.indexOf('mouse') !== -1 ? event.pageX : event.touches[0].clientX;
        }
        
        function touchStart(event) {
            startX = getPositionX(event);
            isDragging = true;
            hasMoved = false;
            touchStartTime = Date.now();
            
            // Verifica se clicou em uma imagem (busca também em parent caso clique na borda)
            var target = event.target;
            if (target.tagName === 'IMG') {
                clickedImage = target;
            } else if (target.querySelector && target.querySelector('img')) {
                clickedImage = target.querySelector('img');
            } else {
                clickedImage = null;
            }
            
            // Desabilita a transição durante o drag
            track.style.transition = 'none';
        }
        
        function touchMove(event) {
            if (!isDragging) return;
            
            currentX = getPositionX(event);
            var diffX = currentX - startX;
            
            // Marca que houve movimento se passar de 5px
            if (Math.abs(diffX) > 5) {
                hasMoved = true;
            }
            
            // Calcula a posição atual do carrossel
            var currentTranslate = -currentPage * 100;
            
            // Converte o movimento do mouse/dedo em porcentagem
            var trackWidth = track.offsetWidth;
            var movePercent = (diffX / trackWidth) * 100;
            
            // Aplica o movimento
            track.style.transform = 'translateX(' + (currentTranslate + movePercent) + '%)';
        }
        
        function touchEnd(event) {
            if (!isDragging) return;
            
            isDragging = false;
            
            // Reativa a transição
            track.style.transition = 'transform 0.5s ease';
            
            var diffX = currentX - startX;
            var threshold = 50; // pixels mínimos para mudar de página
            var touchDuration = Date.now() - touchStartTime;
            
            // Se foi um clique rápido (sem movimento) E clicou em uma imagem
            // Abre o lightbox diretamente aqui
            if (!hasMoved && touchDuration < 300 && clickedImage) {
                update();
                console.log('[CAROUSEL] Clique rápido em imagem - abrindo lightbox');
                
                // Abre o lightbox diretamente
                var lightbox = document.getElementById('feedbackLightbox');
                var lightboxImg = document.getElementById('lightboxImage');
                
                if (lightbox && lightboxImg && clickedImage) {
                    lightboxImg.src = clickedImage.src;
                    lightbox.className = 'lightbox active';
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                    console.log('[CAROUSEL] Lightbox aberto com sucesso!');
                }
                
                return;
            }
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe para direita (voltar)
                    goPrev();
                } else {
                    // Swipe para esquerda (avançar)
                    goNext();
                }
            } else {
                // Volta para a posição atual
                update();
            }
        }
        
        // Event listeners para TOUCH (mobile)
        track.addEventListener('touchstart', touchStart);
        track.addEventListener('touchmove', touchMove, { passive: true });
        track.addEventListener('touchend', touchEnd);
        
        // Event listeners para MOUSE (desktop - drag)
        track.addEventListener('mousedown', touchStart);
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', function() {
            if (isDragging) {
                touchEnd();
            }
        });
        
        // Previne o comportamento padrão de arrastar imagem
        track.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
        
        // Botões de navegação
        if (prevBtn) prevBtn.onclick = goPrev;
        if (nextBtn) nextBtn.onclick = goNext;
        
        // Inicialização
        updateSlidesPerView();
        createDots();
        update();
        
        // Atualiza ao redimensionar a janela
        window.addEventListener('resize', function() {
            updateSlidesPerView();
            createDots();
            update();
        });
        
        console.log('[CAROUSEL] Inicializado com sucesso! Swipe ativado.');
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
        
        // Apenas adiciona cursor pointer e previne drag
        for (var i = 0; i < images.length; i++) {
            images[i].style.cursor = 'pointer';
            
            // Previne o comportamento padrão de arrastar imagem
            images[i].addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        }
        
        // NOTA: O lightbox agora é aberto diretamente pelo carrossel
        // quando detecta um clique rápido em uma imagem.
        
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
