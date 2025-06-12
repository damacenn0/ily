// Variáveis globais
let currentImageIndex = 0;
const totalImages = 6;
const modal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeModal();
    addKeyboardNavigation();
    addTouchSupport();
    addAnimations();
});

// Inicializa a galeria de fotos
function initializeGallery() {
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach((item, index) => {
        // Adiciona evento de clique para abrir o modal
        item.addEventListener('click', () => {
            openModal(index);
        });
        
        // Adiciona suporte para navegação por teclado
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(index);
            }
        });
        
        // Adiciona efeito de hover suave
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Inicializa o modal
function initializeModal() {
    // Evento para fechar o modal
    closeBtn.addEventListener('click', closeModal);
    
    // Fecha o modal ao clicar fora da imagem
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navegação entre imagens
    prevBtn.addEventListener('click', () => {
        navigateImage(-1);
    });
    
    nextBtn.addEventListener('click', () => {
        navigateImage(1);
    });
}

// Abre o modal com a imagem especificada
function openModal(imageIndex) {
    currentImageIndex = imageIndex;
    updateModalImage();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Previne scroll do body
    
    // Adiciona animação de entrada
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transition = 'opacity 0.3s ease';
    }, 10);
    
    // Foca no modal para acessibilidade
    modal.focus();
}

// Fecha o modal
function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura scroll do body
    }, 300);
}

// Atualiza a imagem do modal
function updateModalImage() {
    const imagePath = `imagens/foto${currentImageIndex + 1}.jpg`;
    modalImage.src = imagePath;
    modalImage.alt = `Foto ${currentImageIndex + 1} - Nossa memória especial`;
    
    // Adiciona efeito de carregamento
    modalImage.style.opacity = '0';
    modalImage.onload = () => {
        modalImage.style.opacity = '1';
        modalImage.style.transition = 'opacity 0.3s ease';
    };
    
    // Atualiza estado dos botões de navegação
    updateNavigationButtons();
}

// Navega entre as imagens
function navigateImage(direction) {
    currentImageIndex += direction;
    
    // Loop circular
    if (currentImageIndex >= totalImages) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = totalImages - 1;
    }
    
    updateModalImage();
    
    // Adiciona feedback visual ao botão clicado
    const clickedBtn = direction > 0 ? nextBtn : prevBtn;
    clickedBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        clickedBtn.style.transform = 'scale(1)';
    }, 150);
}

// Atualiza o estado dos botões de navegação
function updateNavigationButtons() {
    // Sempre mantém os botões ativos para navegação circular
    prevBtn.style.opacity = '1';
    nextBtn.style.opacity = '1';
    
    // Adiciona indicador visual da posição atual
    const indicator = document.querySelector('.image-indicator');
    if (indicator) {
        indicator.textContent = `${currentImageIndex + 1} / ${totalImages}`;
    }
}

// Adiciona navegação por teclado
function addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    navigateImage(-1);
                    break;
                case 'ArrowRight':
                    navigateImage(1);
                    break;
                case ' ':
                    e.preventDefault();
                    navigateImage(1);
                    break;
            }
        }
    });
}

// Adiciona suporte para gestos touch em dispositivos móveis
function addTouchSupport() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    modalImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    modalImage.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // Verifica se é um swipe horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                navigateImage(-1); // Swipe para direita = imagem anterior
            } else {
                navigateImage(1);  // Swipe para esquerda = próxima imagem
            }
        }
    }
}

// Adiciona animações e efeitos especiais
function addAnimations() {
    // Animação de entrada para elementos da página
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação de entrada
    const animatedElements = document.querySelectorAll('.photo-item, .message-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Efeito parallax suave nos corações
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hearts = document.querySelectorAll('.heart');
        
        hearts.forEach((heart, index) => {
            const speed = 0.5 + (index * 0.1);
            heart.style.transform = `translateY(${scrolled * speed}px) scale(1)`;
        });
    });
}

// Função para lazy loading das imagens
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Função para otimizar performance
function optimizePerformance() {
    // Debounce para eventos de scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Código de scroll otimizado aqui
        }, 16); // ~60fps
    });
    
    // Preload das imagens do modal
    for (let i = 1; i <= totalImages; i++) {
        const img = new Image();
        img.src = `imagens/foto${i}.jpg`;
    }
}

// Função para adicionar indicador de carregamento
function addLoadingIndicator() {
    const loadingHTML = `
        <div class="loading-indicator" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--primary-color);
            font-size: 2rem;
            display: none;
        ">
            <div class="spinner" style="
                border: 3px solid rgba(255, 107, 157, 0.3);
                border-top: 3px solid var(--primary-color);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            "></div>
            Carregando...
        </div>
    `;
    
    modal.querySelector('.modal-content').insertAdjacentHTML('beforeend', loadingHTML);
    
    // Adiciona CSS para animação do spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializa otimizações quando a página carrega
window.addEventListener('load', () => {
    lazyLoadImages();
    optimizePerformance();
    addLoadingIndicator();
});

// Adiciona suporte para PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registra service worker se disponível
        // navigator.serviceWorker.register('/sw.js');
    });
}


// Controle de música de fundo
let isPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');

// Inicializa controle de música
function initializeMusicControl() {
    if (musicToggle && backgroundMusic) {
        musicToggle.addEventListener('click', toggleMusic);
        
        // Define volume inicial
        backgroundMusic.volume = 0.3;
        
        // Eventos de áudio
        backgroundMusic.addEventListener('play', () => {
            isPlaying = true;
            updateMusicButton();
        });
        
        backgroundMusic.addEventListener('pause', () => {
            isPlaying = false;
            updateMusicButton();
        });
        
        backgroundMusic.addEventListener('ended', () => {
            isPlaying = false;
            updateMusicButton();
        });
    }
}

// Alterna reprodução da música
function toggleMusic() {
    if (isPlaying) {
        backgroundMusic.pause();
    } else {
        // Tenta reproduzir a música
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Música iniciada com sucesso
            }).catch(error => {
                console.log('Erro ao reproduzir música:', error);
                // Fallback: mostra mensagem para o usuário
                showMusicMessage();
            });
        }
    }
}

// Atualiza o botão de música
function updateMusicButton() {
    if (isPlaying) {
        musicIcon.textContent = '🔇';
        musicToggle.classList.add('playing');
        musicToggle.title = 'Pausar música';
    } else {
        musicIcon.textContent = '🎵';
        musicToggle.classList.remove('playing');
        musicToggle.title = 'Tocar música';
    }
}

// Mostra mensagem sobre música (caso não consiga reproduzir automaticamente)
function showMusicMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-card);
        backdrop-filter: blur(10px);
        border: 1px solid var(--primary-color);
        color: var(--text-light);
        padding: 15px;
        border-radius: 10px;
        z-index: 1001;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    message.innerHTML = 'Clique no botão 🎵 para tocar a música de fundo';
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 5000);
}

// Adiciona controle de música à inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeModal();
    addKeyboardNavigation();
    addTouchSupport();
    addAnimations();
    initializeMusicControl(); // Nova função
});

