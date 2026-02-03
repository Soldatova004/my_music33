// optimize.js - Оптимизация скорости загрузки

// 1. ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
// Загружаем картинки только когда они видны на экране
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    // Создаем "наблюдатель" за картинками
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Если картинка появилась в зоне видимости - загружаем
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    // Начинаем наблюдать за всеми картинками
    images.forEach(img => observer.observe(img));
}

// 2. ОПТИМИЗАЦИЯ LOCALSTORAGE
// Не сохраняем данные слишком часто
function optimizeLocalStorage() {
    const originalSetItem = Storage.prototype.setItem;
    let lastSaveTime = 0;
    
    Storage.prototype.setItem = function(key, value) {
        // Для корзины и пользователей - ограничиваем частоту сохранения
        if (key === 'cart' || key === 'users') {
            const now = Date.now();
            // Если сохраняли меньше 2 секунд назад - пропускаем
            if (now - lastSaveTime < 2000) {
                return;
            }
            lastSaveTime = now;
        }
        // Вызываем оригинальный метод
        originalSetItem.call(this, key, value);
    };
}

// 3. ОПТИМИЗАЦИЯ РЕНДЕРИНГА ТОВАРОВ
// Рендерим товары частями, а не все сразу
function renderProductsOptimized() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // Разбиваем товары на части
    const products = window.products || [];
    const chunkSize = 4; // Показываем по 4 товара за раз
    
    function renderChunk(startIndex) {
        const endIndex = Math.min(startIndex + chunkSize, products.length);
        const chunk = products.slice(startIndex, endIndex);
        
        chunk.forEach(product => {
            const html = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="product-price">${product.price} руб.</p>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });
        
        // Если есть еще товары - рендерим следующую часть через 100мс
        if (endIndex < products.length) {
            setTimeout(() => renderChunk(endIndex), 100);
        }
    }
    
    renderChunk(0);
}

// 4. ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
function initOptimizations() {
    console.log('Запуск оптимизаций...');
    
    // Запускаем оптимизации с задержкой, чтобы не блокировать загрузку
    setTimeout(() => {
        lazyLoadImages();
        optimizeLocalStorage();
        
        // Если на странице есть товары - рендерим их оптимизированно
        if (document.getElementById('products-container')) {
            renderProductsOptimized();
        }
    }, 500);
    
    // Показываем сообщение о загрузке
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        setTimeout(() => {
            loadingEl.style.display = 'none';
        }, 1000);
    }
}

// Запускаем когда страница полностью загрузилась
window.addEventListener('load', initOptimizations);

// Быстрые функции для немедленного использования
window.quickAddToCart = function(productId) {
    if (window.cart) {
        const product = (window.products || []).find(p => p.id === productId);
        if (product) {
            cart.addItem(product, 1);
            // Быстрое уведомление без сложной анимации
            alert('Добавлено в корзину!');
        }
    }
};
