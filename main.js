// main.js - Основной файл с виниловыми пластинками
const vinylImages = [
    "https://picsum.photos/400/400?random=1",
    "https://picsum.photos/400/400?random=2", 
    "https://picsum.photos/400/400?random=3",
    "https://picsum.photos/400/400?random=4",
    "https://picsum.photos/400/400?random=5",
    "https://picsum.photos/400/400?random=6" 
    {
        id: 1,
        name: "The Beatles - Abbey Road",
        price: 3499,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Легендарный альбом 1969 года, последняя совместная запись The Beatles",
        genre: "Рок",
        year: 1969,
        rating: 5
    },
    {
        id: 2,
        name: "Pink Floyd - The Dark Side of the Moon",
        price: 3999,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Культовый прогрессив-рок альбом, один из самых продаваемых в истории",
        genre: "Прогрессив-рок",
        year: 1973,
        rating: 5
    },
    {
        id: 3,
        name: "Miles Davis - Kind of Blue",
        price: 3299,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Величайший джазовый альбом всех времен, эталон модального джаза",
        genre: "Джаз",
        year: 1959,
        rating: 5
    },
    {
        id: 4,
        name: "Daft Punk - Random Access Memories",
        price: 2899,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Грэмми-альбом электронной музыки, современная классика",
        genre: "Электроника",
        year: 2013,
        rating: 4
    },
    {
        id: 5,
        name: "Amy Winehouse - Back to Black",
        price: 2799,
        image: "https://images.unsplash.com/photo-1526281216101-ea7f5d8c55d9?w=400&h=400&fit=crop",
        description: "Современная классика соула, посмертный шедевр",
        genre: "Соул, R&B",
        year: 2006,
        rating: 5
    },
    {
        id: 6,
        name: "Queen - A Night at the Opera",
        price: 3699,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Шедевр рок-музыки с легендарной 'Bohemian Rhapsody'",
        genre: "Рок",
        year: 1975,
        rating: 5
    },
    {
        id: 7,
        name: "Nirvana - Nevermind",
        price: 3199,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Икона гранжа, изменившая лицо рок-музыки 90-х",
        genre: "Гранж",
        year: 1991,
        rating: 5
    },
    {
        id: 8,
        name: "Radiohead - OK Computer",
        price: 2999,
        image: "https://placehold.co/400x400/8B008B/FFFFFF/png?text=VINYL+RECORD",
        description: "Прогрессив-рок альбом, предсказавший цифровую эпоху",
        genre: "Альтернативный рок",
        year: 1997,
        rating: 5
    }
];

function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="background: #FFE4E9; color: var(--primary-color); padding: 0.2rem 0.8rem; border-radius: 15px; font-size: 0.9em;">
                        ${product.genre}
                    </span>
                    <span style="color: #666; font-size: 0.9em;">${product.year} год</span>
                </div>
                <p style="color: #666; font-size: 0.95em; margin-bottom: 1rem;">${product.description}</p>
                
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="10" 
                           onchange="validateQuantity(${product.id})" style="width: 60px; text-align: center;">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <p class="product-price">${product.price} руб.</p>
                    <div style="color: #FFD700;">
                        ${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}
                    </div>
                </div>
                
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Добавить в корзину
                </button>
            </div>
        </div>
    `).join('');
}

function updateQuantity(productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
}

function validateQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 10) value = 10;
    input.value = value;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (product && quantity > 0) {
        if (window.cart) {
            cart.addItem(product, quantity);
        } else {
            alert(`${product.name} добавлен в корзину!`);
        }
        // Сбрасываем количество после добавления
        if (quantityInput) quantityInput.value = 1;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // Обновляем ссылки авторизации
    if (window.auth) {
        auth.updateAuthLinks();
    }
    
    // Обновляем счетчик корзины
    if (window.cart) {
        cart.updateCartCount();
    }

});
