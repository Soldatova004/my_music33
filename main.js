// main.js
// Данные товаров
const products = [
    {
        id: 1,
        name: "Электрогитара Fender",
        price: 45000,
        image: "https://images.unsplash.com/photo-1558098329-a00c217b216d?w=400&h=300&fit=crop",
        description: "Профессиональная электрогитара"
    },
    {
        id: 2,
        name: "Акустическая гитара",
        price: 25000,
        image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop",
        description: "Качественная акустика"
    },
    {
        id: 3,
        name: "Синтезатор Yamaha",
        price: 35000,
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w-400&h=300&fit=crop",
        description: "Цифровой синтезатор"
    },
    {
        id: 4,
        name: "Барабанная установка",
        price: 75000,
        image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=300&fit=crop",
        description: "Полная барабанная установка"
    },
    {
        id: 5,
        name: "Микрофон Shure",
        price: 12000,
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop",
        description: "Студийный микрофон"
    },
    {
        id: 6,
        name: "Наушники Audio-Technica",
        price: 15000,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        description: "Профессиональные наушники"
    }
];

// Рендеринг товаров
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="99" 
                           onchange="validateQuantity(${product.id})" style="width: 50px; text-align: center;">
                    <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                </div>
                <p class="product-price">${product.price} руб.</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Добавить в корзину
                </button>
            </div>
        </div>
    `).join('');
}

// Функции для работы с количеством
function updateQuantity(productId, change) {
    const input = document.getElementById(`qty-${productId}`);
    let value = parseInt(input.value) + change;
    if (value < 1) value = 1;
    if (value > 99) value = 99;
    input.value = value;
}

function validateQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) value = 1;
    if (value > 99) value = 99;
    input.value = value;
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    
    if (product && quantity > 0) {
        cart.addItem(product, quantity);
    }
}

// Оформление заказа
function checkout() {
    if (!auth.currentUser) {
        alert('Пожалуйста, войдите в систему для оформления заказа');
        window.location.href = 'login.html';
        return;
    }

    if (cart.items.length === 0) {
        alert('Корзина пуста');
        return;
    }

    const order = {
        items: [...cart.items],
        total: cart.getTotal(),
        shippingAddress: '',
        paymentMethod: 'card'
    };

    // Добавляем заказ в историю пользователя
    auth.addOrder(order);
    
    // Очищаем корзину
    cart.clearCart();
    
    alert('Заказ успешно оформлен! Номер вашего заказа: #' + Date.now());
    window.location.href = 'dashboard.html';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // Если на странице корзины, рендерим корзину
    if (document.getElementById('cart-container')) {
        renderCart();
    }
    
    // Если в админке, загружаем заказы
    if (document.getElementById('admin-orders')) {
        loadAdminOrders();
    }
    
    // Если в личном кабинете, загружаем заказы пользователя
    if (document.getElementById('user-orders')) {
        loadUserOrders();
    }
});
