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
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const goal = document.getElementById('goal').value;
    const level = document.getElementById('level').value;
    
    // Map select values to readable text
    const goalTexts = {
        'comecar': 'Começar a correr do zero',
        'melhorar': 'Melhorar meus tempos',
        'prova': 'Me preparar para uma prova',
        'saude': 'Correr com saúde e consistência',
        'outro': 'Outro objetivo'
    };
    
    const levelTexts = {
        'iniciante': 'Iniciante',
        'intermediario': 'Intermediário',
        'avancado': 'Avançado'
    };
    
    const message = `Olá, Karina! Meu nome é ${name}.

Vim pelo seu site e quero começar uma assessoria de corrida.

📌 Meu objetivo: ${goalTexts[goal]}
📊 Meu nível atual: ${levelTexts[level]}

Pode me explicar como funciona?`;
    
    const whatsappURL = `https://wa.me/5517996566908?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
});

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
// Enhanced Lazy Loading with Performance Optimizations
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
        rootMargin: '50px' // Start loading 50px before entering viewport
    });
    
    // Observe all images with lazy loading
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

// Apply animation to sections
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

// Add pulse animation to CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// ===========================
// Carrossel de Feedbacks - 3 Imagens
// ===========================
class FeedbackCarousel {
    constructor() {
        // Elementos DOM
        this.carousel = document.querySelector('.feedbacks-carousel');
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.indicatorsContainer = document.querySelector('.carousel-indicators');
        this.container = document.querySelector('.carousel-container');
        
        // Estado
        this.currentPage = 0;
        this.slidesPerView = 3;
        this.totalSlides = this.slides.length;
        this.isTransitioning = false;
        
        // Inicializar
        this.init();
    }
    
    init() {
        if (!this.track || this.totalSlides === 0) {
            return; // Carrossel não encontrado ou vazio
        }
        
        // Calcular slides por visualização
        this.updateSlidesPerView();
        
        // Criar indicadores
        this.createIndicators();
        
        // Event listeners
        this.prevBtn?.addEventListener('click', () => this.goToPrevPage());
        this.nextBtn?.addEventListener('click', () => this.goToNextPage());
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/Swipe para mobile
        this.setupTouchEvents();
        
        // Resize
        this.setupResizeHandler();
        
        // Atualizar visual inicial
        this.updateCarousel();
    }
    
    updateSlidesPerView() {
        if (window.innerWidth <= 640) {
            this.slidesPerView = 1;
        } else if (window.innerWidth <= 968) {
            this.slidesPerView = 2;
        } else {
            this.slidesPerView = 3;
        }
    }
    
    getTotalPages() {
        return Math.ceil(this.totalSlides / this.slidesPerView);
    }
    
    createIndicators() {
        if (!this.indicatorsContainer) return;
        
        this.indicatorsContainer.innerHTML = '';
        const totalPages = this.getTotalPages();
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'indicator';
            indicator.setAttribute('aria-label', `Ir para página ${i + 1}`);
            indicator.addEventListener('click', () => this.goToPage(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    goToPage(pageIndex) {
        if (this.isTransitioning) return;
        
        const totalPages = this.getTotalPages();
        if (pageIndex < 0 || pageIndex >= totalPages) return;
        
        this.currentPage = pageIndex;
        this.updateCarousel();
    }
    
    goToNextPage() {
        if (this.isTransitioning) return;
        
        const totalPages = this.getTotalPages();
        // Navegação cíclica: volta para a primeira página após a última
        this.currentPage = (this.currentPage + 1) % totalPages;
        this.updateCarousel();
    }
    
    goToPrevPage() {
        if (this.isTransitioning) return;
        
        const totalPages = this.getTotalPages();
        // Navegação cíclica: vai para a última página antes da primeira
        this.currentPage = (this.currentPage - 1 + totalPages) % totalPages;
        this.updateCarousel();
    }
    
    updateCarousel() {
        this.isTransitioning = true;
        
        const totalPages = this.getTotalPages();
        this.currentPage = Math.max(0, Math.min(this.currentPage, totalPages - 1));
        
        // Calcular o deslocamento
        const slideWidth = 100 / this.slidesPerView;
        const movePercentage = -this.currentPage * slideWidth * this.slidesPerView;
        this.track.style.transform = `translateX(${movePercentage}%)`;
        
        // Atualizar indicadores
        const indicators = this.indicatorsContainer?.querySelectorAll('.indicator');
        indicators?.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === this.currentPage);
        });
        
        // Navegação cíclica: botões sempre ativos
        if (this.prevBtn) {
            this.prevBtn.disabled = false;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = false;
        }
        
        // Liberar após transição
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }
    
    handleKeyboard(e) {
        if (!this.carousel) return;
        
        const carouselRect = this.carousel.getBoundingClientRect();
        const isInViewport = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;
        if (!isInViewport) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.goToPrevPage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.goToNextPage();
                break;
        }
    }
    
    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        this.track?.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.track?.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) {
                    this.goToNextPage();
                } else {
                    this.goToPrevPage();
                }
            }
        }, { passive: true });
    }
    
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const oldSlidesPerView = this.slidesPerView;
                this.updateSlidesPerView();
                
                if (oldSlidesPerView !== this.slidesPerView) {
                    this.currentPage = 0;
                    this.createIndicators();
                    this.updateCarousel();
                }
            }, 250);
        });
    }
    
    destroy() {
        // Cleanup se necessário
    }
}

// Inicializar carrossel quando o DOM estiver pronto
function initFeedbackCarousel() {
    // Destruir instância anterior se existir
    if (window.feedbackCarousel) {
        window.feedbackCarousel.destroy();
    }
    // Criar nova instância
    window.feedbackCarousel = new FeedbackCarousel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedbackCarousel);
} else {
    initFeedbackCarousel();
}

// Reinicializar quando a página voltar a ficar visível (navegação back/forward)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && document.querySelector('.feedbacks-carousel')) {
        initFeedbackCarousel();
    }
});

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    if (window.feedbackCarousel) {
        window.feedbackCarousel.destroy();
    }
});

// ===========================
// Lightbox para Feedbacks
// ===========================
class FeedbackLightbox {
    constructor() {
        this.lightbox = document.getElementById('feedbackLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.closeBtn = this.lightbox?.querySelector('.lightbox-close');
        this.overlay = this.lightbox?.querySelector('.lightbox-overlay');
        
        this.init();
    }
    
    init() {
        if (!this.lightbox) return;
        
        // Adicionar event listeners em todas as imagens de feedback
        const feedbackImages = document.querySelectorAll('.feedback-card img');
        feedbackImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => this.openLightbox(e.target));
        });
        
        // Event listeners para fechar
        this.closeBtn?.addEventListener('click', () => this.closeLightbox());
        this.overlay?.addEventListener('click', () => this.closeLightbox());
        
        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.closeLightbox();
            }
        });
    }
    
    openLightbox(imgElement) {
        if (!this.lightbox || !this.lightboxImage) return;
        
        // Definir a imagem do lightbox
        this.lightboxImage.src = imgElement.src;
        this.lightboxImage.alt = imgElement.alt;
        
        // Mostrar o lightbox
        this.lightbox.classList.add('active');
        this.lightbox.setAttribute('aria-hidden', 'false');
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        if (!this.lightbox) return;
        
        // Esconder o lightbox
        this.lightbox.classList.remove('active');
        this.lightbox.setAttribute('aria-hidden', 'true');
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        // Limpar a imagem após a animação
        setTimeout(() => {
            if (this.lightboxImage) {
                this.lightboxImage.src = '';
                this.lightboxImage.alt = '';
            }
        }, 300);
    }
}

// Inicializar lightbox quando o DOM estiver pronto
function initFeedbackLightbox() {
    window.feedbackLightbox = new FeedbackLightbox();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedbackLightbox);
} else {
    initFeedbackLightbox();
}

// Reinicializar quando a página voltar a ficar visível
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && document.getElementById('feedbackLightbox')) {
        initFeedbackLightbox();
    }
});