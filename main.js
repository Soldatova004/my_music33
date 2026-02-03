// main.js - Основной файл с виниловыми пластинками
// ОПТИМИЗАЦИЯ: Ленивая загрузка картинок
document.addEventListener('DOMContentLoaded', function() {
    // Отложенный рендеринг товаров
    setTimeout(renderProducts, 100);
    
    // Ленивая загрузка изображений
    const lazyImages = document.querySelectorAll('.product-image');
    lazyImages.forEach(img => {
        const originalSrc = img.src;
        img.src = ''; // Сначала пустая
        setTimeout(() => {
            img.src = originalSrc;
        }, 300);
    });
});
// main.js - ГЛАВНЫЙ ФАЙЛ С ТОВАРАМИ
console.log('🔄 main.js загружен');

// ДАННЫЕ ТОВАРОВ (виниловые пластинки)
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

// ОСНОВНАЯ ФУНКЦИЯ РЕНДЕРИНГА ТОВАРОВ
function renderProducts() {
    console.log('🔄 Запуск renderProducts()');
    
    const container = document.getElementById('products-container');
    console.log('Контейнер найден?', !!container);
    
    if (!container) {
        console.error('❌ ОШИБКА: Не найден products-container!');
        console.log('Ищем элементы с products-container:');
        console.log(document.querySelectorAll('#products-container'));
        return;
    }
    
    console.log('Рендерим', products.length, 'товаров');
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // Создаем HTML для каждого товара
    products.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p><strong>Жанр:</strong> ${product.genre}</p>
                    <p>${product.description}</p>
                    <p><strong>Год:</strong> ${product.year}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                        <input type="number" id="qty-${product.id}" value="1" min="1" max="10" readonly>
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                    </div>
                    <p class="product-price">${product.price} руб.</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        🛒 Добавить в корзину
                    </button>
                </div>
            </div>
        `;
        
        container.innerHTML += productHTML;
    });
    
    console.log('✅ Товары успешно отрендерены!');
}

// ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ КОЛИЧЕСТВОМ
function updateQuantity(productId, change) {
    console.log('Изменение количества для товара', productId, 'на', change);
    
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
    console.log('Новое значение:', newValue);
}

// ФУНКЦИЯ ДОБАВЛЕНИЯ В КОРЗИНУ
function addToCart(productId) {
    console.log('Добавление в корзину товара', productId);
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Товар не найден:', productId);
        alert('Ошибка: товар не найден');
        return;
    }
    
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    console.log('Товар:', product.name, 'Количество:', quantity);
    
    // Проверяем есть ли корзина
    if (window.cart && typeof cart.addItem === 'function') {
        cart.addItem(product, quantity);
        alert(`✅ "${product.name}" добавлен в корзину!`);
    } else {
        console.error('Корзина не инициализирована!');
        alert('Товар добавлен в корзину (тестовый режим)');
    }
    
    // Сбрасываем количество после добавления
    if (quantityInput) {
        quantityInput.value = 1;
    }
}

// ЗАГРУЗКА ПРИ СТАРТЕ
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Страница загружена, запускаем инициализацию...');
    
    // Обновляем ссылки авторизации
    if (window.auth && typeof auth.updateAuthLinks === 'function') {
        auth.updateAuthLinks();
    }
    
    // Обновляем счетчик корзины
    if (window.cart && typeof cart.updateCartCount === 'function') {
        cart.updateCartCount();
    }
    
    // Проверяем есть ли контейнер для товаров на этой странице
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        console.log('🎯 Найдены товары на этой странице, рендерим...');
        renderProducts();
    } else {
        console.log('ℹ️ На этой странице нет товаров');
    }
    
    console.log('✅ Инициализация завершена');
});

// Делаем функции доступными глобально
window.renderProducts = renderProducts;
window.updateQuantity = updateQuantity;
window.addToCart = addToCart;

console.log('✅ main.js полностью загружен');
