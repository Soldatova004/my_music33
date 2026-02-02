// cart.js - Корзина покупок
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} добавлен в корзину!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Товар удален из корзины');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.renderCart();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                    <a href="catalog.html" class="hero-btn" style="margin-top: 1rem;">Перейти в каталог</a>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '0';
            return;
        }

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div style="flex: 1;">
                    <h3>${item.name}</h3>
                    <p class="product-price">${item.price} руб.</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span style="font-weight: bold; min-width: 40px; text-align: center;">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div>
                    <p class="product-price">${(item.price * item.quantity).toFixed(2)} руб.</p>
                    <button onclick="cart.removeItem(${item.id})" 
                            style="color: var(--accent-color); border: none; background: none; cursor: pointer; padding: 0.5rem;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        if (cartTotal) {
            cartTotal.textContent = this.getTotal().toFixed(2);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    checkout() {
        if (!window.auth || !window.auth.currentUser) {
            this.showNotification('Пожалуйста, войдите в систему для оформления заказа');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        if (this.items.length === 0) {
            this.showNotification('Корзина пуста');
            return;
        }

        // Создаем заказ
        const order = {
            id: Date.now(),
            items: [...this.items],
            total: this.getTotal(),
            date: new Date().toISOString(),
            status: 'pending'
        };

        // Сохраняем заказ для пользователя
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = window.auth.currentUser;
        
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.push(order);
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Очищаем корзину
        this.clearCart();
        
        this.showNotification(`Заказ #${order.id} успешно оформлен!`);
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
}

// Создаем глобальный экземпляр корзины
window.cart = new Cart();

// Функция оформления заказа (вызывается из кнопки)
function checkout() {
    if (window.cart) {
        cart.checkout();
    }
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.cart) {
        cart.renderCart();
    }
});