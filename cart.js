// cart.js - РАБОЧАЯ КОРЗИНА
console.log('🛒 cart.js загружен');

class Cart {
    constructor() {
        this.items = this.loadCart();
        console.log('Корзина загружена, товаров:', this.items.length);
        this.updateCartCount();
    }

    // Загружаем корзину из LocalStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('cart');
            const cart = savedCart ? JSON.parse(savedCart) : [];
            console.log('Загруженная корзина:', cart);
            return cart;
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            return [];
        }
    }

    // Сохраняем корзину
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.updateCartCount();
            console.log('Корзина сохранена:', this.items);
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    }

    // Обновляем счетчик в шапке
    updateCartCount() {
        const count = this.items.reduce((total, item) => total + (item.quantity || 1), 0);
        const cartCountElement = document.getElementById('cart-count');
        
        if (cartCountElement) {
            cartCountElement.textContent = count;
            console.log('Счетчик обновлен:', count);
        }
    }

    // Добавляем товар
    addItem(product, quantity = 1) {
        console.log('➕ Добавляем товар:', product.name, quantity);
        
        // Ищем товар в корзине
        const existingIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            // Увеличиваем количество
            this.items[existingIndex].quantity = (this.items[existingIndex].quantity || 1) + quantity;
            console.log('Товар обновлен:', this.items[existingIndex]);
        } else {
            // Добавляем новый товар
            const newItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            };
            this.items.push(newItem);
            console.log('Новый товар добавлен:', newItem);
        }
        
        this.saveCart();
        this.showNotification(`✅ "${product.name}" добавлен в корзину!`);
    }

    // Удаляем товар
    removeItem(productId) {
        console.log('➖ Удаляем товар:', productId);
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== productId);
        
        if (this.items.length < initialLength) {
            this.saveCart();
            this.showNotification('🗑️ Товар удален из корзины');
            return true;
        }
        return false;
    }

    // Обновляем количество
    updateQuantity(productId, newQuantity) {
        console.log('✏️ Меняем количество:', productId, newQuantity);
        
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            return true;
        }
        return false;
    }

    // Показываем корзину
    renderCart() {
        console.log('🎯 Рендерим корзину...');
        
        const cartContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartContainer) {
            console.error('❌ Не найден cart-items');
            return;
        }
        
        console.log('Товаров в корзине:', this.items.length);
        
        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 4rem; color: #ccc;">🛒</div>
                    <h3>Ваша корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                    <a href="catalog.html" style="display: inline-block; margin-top: 1rem; padding: 10px 25px; background: #8B008B; color: white; text-decoration: none; border-radius: 8px;">
                        🎵 Перейти в каталог
                    </a>
                </div>
            `;
            
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }
        
        // Рассчитываем общую сумму
        let total = 0;
        
        // Рендерим каждый товар
        let itemsHTML = '';
        
        this.items.forEach(item => {
            const itemTotal = item.price * (item.quantity || 1);
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item" style="display: flex; align-items: center; padding: 1rem; border-bottom: 2px solid #FFE4E9; gap: 1rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 10px; border: 2px solid #FF69B4;">
                    
                    <div style="flex: 1;">
                        <h3 style="color: #8B008B; margin: 0 0 0.5rem 0;">${item.name}</h3>
                        <p style="color: #666; margin: 0;">Цена: ${item.price} ₽</p>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <button onclick="cart.updateQuantity(${item.id}, ${(item.quantity || 1) - 1})" 
                                style="background: #FF69B4; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">-</button>
                        
                        <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.quantity || 1}</span>
                        
                        <button onclick="cart.updateQuantity(${item.id}, ${(item.quantity || 1) + 1})" 
                                style="background: #FF69B4; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;">+</button>
                    </div>
                    
                    <div style="text-align: right;">
                        <p style="color: #C71585; font-weight: bold; font-size: 1.2rem; margin: 0;">${itemTotal.toFixed(2)} ₽</p>
                        <button onclick="cart.removeItem(${item.id})" 
                                style="background: none; border: none; color: #FF69B4; cursor: pointer; margin-top: 0.5rem;">
                            🗑️ Удалить
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartContainer.innerHTML = itemsHTML;
        
        // Обновляем итоговую сумму
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }
        
        console.log('✅ Корзина отрендерена, итого:', total.toFixed(2), '₽');
    }

    // Оформление заказа
    checkout() {
        console.log('💰 Оформляем заказ...');
        
        // Проверяем авторизацию
        if (!window.auth || !auth.currentUser) {
            this.showNotification('❌ Войдите в систему для оформления заказа');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        
        if (this.items.length === 0) {
            this.showNotification('🛒 Корзина пуста');
            return;
        }
        
        // Рассчитываем итого
        const total = this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        
        // Создаем заказ
        const order = {
            id: Date.now(),
            items: [...this.items],
            total: total,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        console.log('Создан заказ:', order);
        
        // Сохраняем заказ у пользователя
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === auth.currentUser.email);
        
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.push(order);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Заказ сохранен для пользователя:', auth.currentUser.name);
        }
        
        // Очищаем корзину
        this.clearCart();
        
        // Показываем успешное сообщение
        this.showNotification(`✅ Заказ #${order.id} оформлен! Сумма: ${total.toFixed(2)} ₽`);
        
        // Перенаправляем в личный кабинет
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }

    // Очищаем корзину
    clearCart() {
        console.log('🗑️ Очищаем корзину');
        this.items = [];
        this.saveCart();
    }

    // Простое уведомление
    showNotification(message) {
        alert(message);
    }
}

// Создаем глобальный объект корзины
window.cart = new Cart();

// Функция для оформления заказа (вызывается из кнопки)
window.checkout = function() {
    if (window.cart) {
        cart.checkout();
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Страница корзины загружена');
    
    // Если на странице корзины - рендерим её
    if (window.location.pathname.includes('cart.html') || document.getElementById('cart-items')) {
        console.log('🛒 Это страница корзины, рендерим...');
        setTimeout(() => {
            if (window.cart && cart.renderCart) {
                cart.renderCart();
            }
        }, 100);
    }
});

console.log('✅ cart.js готов к работе');
