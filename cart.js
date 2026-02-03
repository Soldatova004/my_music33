// cart.js - КОРЗИНА
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
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            return [];
        }
    }

    // Сохраняем корзину в LocalStorage
    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.updateCartCount();
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
        }
    }

    // Добавляем товар в корзину
    addItem(product, quantity = 1) {
        console.log('➕ Добавляем товар:', product.name, quantity);
        
        // Проверяем есть ли уже такой товар
        const existingIndex = this.items.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
            // Увеличиваем количество
            this.items[existingIndex].quantity = (this.items[existingIndex].quantity || 1) + quantity;
        } else {
            // Добавляем новый товар
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.saveCart();
        
        // Показываем уведомление
        this.showNotification(`${product.name} добавлен в корзину!`);
    }

    // Простое уведомление
    showNotification(message) {
        alert(message); // Простое уведомление
    }

    // Очищаем корзину
    clearCart() {
        this.items = [];
        this.saveCart();
        console.log('🗑️ Корзина очищена');
    }
}

// Создаем глобальный объект корзины
window.cart = new Cart();

console.log('✅ cart.js готов');
