// cart.js
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
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification('Товар добавлен в корзину!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Создаем глобальный экземпляр корзины
window.cart = new Cart();

// Функция для рендеринга корзины
function renderCart() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    if (cart.items.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        return;
    }

    cartContainer.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover;">
            <div style="flex: 1;">
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div>
                <p class="price">${(item.price * item.quantity).toFixed(2)} руб.</p>
                <button onclick="cart.removeItem(${item.id})" style="color: var(--accent-color); border: none; background: none; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Добавляем итого
    cartContainer.innerHTML += `
        <div class="cart-total">
            <p>Итого: ${cart.getTotal().toFixed(2)} руб.</p>
            <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
        </div>
    `;
}
