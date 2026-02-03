// main.js - ОСНОВНОЙ ФАЙЛ С КАТАЛОГОМ
console.log('✅ main.js загружен');

// ДАННЫЕ ТОВАРОВ
const products = [
    {
        id: 1,
        name: "The Beatles - Abbey Road",
        price: 3499,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=BEATLES",
        description: "Легендарный альбом 1969 года",
        genre: "Рок",
        year: 1969,
        rating: 5
    },
    {
        id: 2,
        name: "Pink Floyd - The Dark Side of the Moon",
        price: 3999,
        image: "https://placehold.co/400x400/FF69B4/000000/png?text=PINK+FLOYD",
        description: "Культовый прогрессив-рок альбом",
        genre: "Прогрессив-рок",
        year: 1973,
        rating: 5
    },
    {
        id: 3,
        name: "Miles Davis - Kind of Blue",
        price: 3299,
        image: "https://placehold.co/400x400/DB7093/FFFFFF/png?text=JAZZ",
        description: "Величайший джазовый альбом всех времен",
        genre: "Джаз",
        year: 1959,
        rating: 5
    },
    {
        id: 4,
        name: "Daft Punk - Random Access Memories",
        price: 2899,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=Daft+Punk",
        description: "Грэмми-альбом электронной музыки",
        genre: "Электроника",
        year: 2013,
        rating: 4
    },
    {
        id: 5,
        name: "Amy Winehouse - Back to Black",
        price: 2799,
        image: "https://placehold.co/400x400/FF69B4/000000/png?text=Amy+Winehouse",
        description: "Современная классика соула",
        genre: "Соул, R&B",
        year: 2006,
        rating: 5
    },
    {
        id: 6,
        name: "Queen - A Night at the Opera",
        price: 3699,
        image: "https://placehold.co/400x400/DB7093/FFFFFF/png?text=QUEEN",
        description: "Шедевр рок-музыки с 'Bohemian Rhapsody'",
        genre: "Рок",
        year: 1975,
        rating: 5
    }
];

// ФУНКЦИЯ ДЛЯ РЕНДЕРИНГА ТОВАРОВ
function renderProducts() {
    console.log('🔄 Запускаем renderProducts()');
    
    // Находим контейнер для товаров
    const container = document.getElementById('products-container');
    console.log('Контейнер найден:', container);
    
    if (!container) {
        console.error('❌ ОШИБКА: Не найден элемент с id="products-container"');
        return;
    }
    
    console.log('Товаров для рендеринга:', products.length);
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Создаем HTML для каждого товара
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p><strong>Жанр:</strong> ${product.genre}</p>
                <p>${product.description}</p>
                <p><strong>Год:</strong> ${product.year}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus-btn" data-id="${product.id}">-</button>
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="10" readonly>
                    <button class="quantity-btn plus-btn" data-id="${product.id}">+</button>
                </div>
                <p class="product-price">${product.price} руб.</p>
                <button class="add-to-cart" data-id="${product.id}">
                    🛒 Добавить в корзину
                </button>
            </div>
        `;
        
        container.appendChild(productCard);
    });
    
    console.log('✅ Товары успешно отрендерены!');
    
    // Добавляем обработчики событий
    addEventListeners();
}

// ФУНКЦИЯ ДЛЯ ОБРАБОТЧИКОВ СОБЫТИЙ
function addEventListeners() {
    console.log('🎯 Добавляем обработчики событий...');
    
    // Обработчики для кнопок количества
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const isPlus = this.classList.contains('plus-btn');
            updateQuantity(productId, isPlus ? 1 : -1);
        });
    });
    
    // Обработчики для кнопок добавления в корзину
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// ФУНКЦИЯ ИЗМЕНЕНИЯ КОЛИЧЕСТВА
function updateQuantity(productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    if (!input) {
        console.error('Не найден input для товара', productId);
        return;
    }
    
    let currentValue = parseInt(input.value) || 1;
    let newValue = currentValue + change;
    
    // Ограничиваем от 1 до 10
    if (newValue < 1) newValue = 1;
    if (newValue > 10) newValue = 10;
    
    input.value = newValue;
    console.log('Товар', productId, 'новое количество:', newValue);
}

// ФУНКЦИЯ ДОБАВЛЕНИЯ В КОРЗИНУ
function addToCart(productId) {
    console.log('🛒 Добавляем в корзину товар', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Товар не найден:', productId);
        alert('❌ Ошибка: товар не найден');
        return;
    }
    
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    console.log('Добавляем:', product.name, 'Количество:', quantity);
    
    // Проверяем есть ли корзина
    if (window.cart && typeof cart.addItem === 'function') {
        cart.addItem(product, quantity);
    } else {
        // Если корзины нет, используем простой alert
        alert(`✅ "${product.name}" добавлен в корзину!`);
    }
    
    // Сбрасываем количество
    if (quantityInput) {
        quantityInput.value = 1;
    }
}

// ЗАГРУЗКА ПРИ СТАРТЕ
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Страница загружена');
    
    // Проверяем есть ли контейнер для товаров
    const productsContainer = document.getElementById('products-container');
    
    if (productsContainer) {
        console.log('🎯 Найдены товары на странице, рендерим...');
        // Небольшая задержка чтобы точно всё загрузилось
        setTimeout(renderProducts, 100);
    } else {
        console.log('ℹ️ На этой странице нет товаров');
    }
    
    // Обновляем навигацию если есть auth
    if (window.auth && typeof auth.updateAuthLinks === 'function') {
        auth.updateAuthLinks();
    }
    
    // Обновляем счетчик корзины
    if (window.cart && typeof cart.updateCartCount === 'function') {
        cart.updateCartCount();
    }
});

// Делаем функции доступными глобально
window.renderProducts = renderProducts;
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;

console.log('✅ main.js готов к работе');
