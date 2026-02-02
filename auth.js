// auth.js - Полная версия с ролями сотрудников
class Auth {
    constructor() {
        this.currentUser = this.loadUser();
        this.updateAuthLinks();
        this.initializeDefaultUsers();
    }

    loadUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    saveUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.updateAuthLinks();
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthLinks();
        window.location.href = 'index.html';
    }

    updateAuthLinks() {
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            if (this.currentUser) {
                authLink.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name.split(' ')[0]}`;
                authLink.href = 'dashboard.html';
                
                // Добавляем кнопку выхода
                const logoutBtn = document.createElement('button');
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
                logoutBtn.title = 'Выйти';
                logoutBtn.style.background = 'none';
                logoutBtn.style.border = '1px solid white';
                logoutBtn.style.color = 'white';
                logoutBtn.style.padding = '0.3rem 0.8rem';
                logoutBtn.style.borderRadius = '3px';
                logoutBtn.style.cursor = 'pointer';
                logoutBtn.style.marginLeft = '0.5rem';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
                
                authLink.parentNode.appendChild(logoutBtn);
            }
        }
    }

    // Инициализация тестовых пользователей (сотрудник и менеджер)
    initializeDefaultUsers() {
        const users = this.getUsers();
        
        // Проверяем, есть ли уже сотрудник
        const employeeExists = users.some(u => u.email === 'employee@vinyl.ru');
        if (!employeeExists) {
            users.push({
                id: 1001,
                name: 'Иванов Алексей Петрович',
                email: 'employee@vinyl.ru',
                phone: '+7 (999) 111-22-33',
                password: '111',
                role: 'employee',
                registrationDate: new Date().toISOString(),
                orders: []
            });
        }
        
        // Проверяем, есть ли уже менеджер
        const managerExists = users.some(u => u.email === 'manager@vinyl.ru');
        if (!managerExists) {
            users.push({
                id: 1002,
                name: 'Смирнова Ольга Ивановна',
                email: 'manager@vinyl.ru',
                phone: '+7 (999) 222-33-44',
                password: '222',
                role: 'manager',
                registrationDate: new Date().toISOString(),
                orders: []
            });
        }
        
        localStorage.setItem('users', JSON.stringify(users));
    }

    async register(userData) {
        const users = this.getUsers();
        
        // Проверяем, существует ли пользователь
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Добавляем нового пользователя
        const newUser = {
            ...userData,
            id: Date.now(),
            registrationDate: new Date().toISOString(),
            orders: [],
            role: 'customer'
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        this.saveUser(newUser);
        
        // Показываем уведомление
        this.showNotification('Регистрация успешна!');
        return newUser;
    }

    async login(email, password) {
        // Проверка специальных доступов (сотрудник и менеджер)
        if (email === 'employee@vinyl.ru' && password === '111') {
            const users = this.getUsers();
            const employee = users.find(u => u.email === 'employee@vinyl.ru');
            
            this.saveUser(employee);
            this.showNotification('Вход выполнен как Сотрудник');
            
            // Перенаправление
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            return employee;
        }

        if (email === 'manager@vinyl.ru' && password === '222') {
            const users = this.getUsers();
            const manager = users.find(u => u.email === 'manager@vinyl.ru');
            
            this.saveUser(manager);
            this.showNotification('Вход выполнен как Менеджер');
            
            // Перенаправление
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
            return manager;
        }

        // Обычный вход для покупателей
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }
        
        this.saveUser(user);
        this.showNotification(`Добро пожаловать, ${user.name.split(' ')[0]}!`);
        
        // Перенаправление
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        return user;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Проверка ролей
    isEmployee() {
        return this.currentUser && this.currentUser.role === 'employee';
    }
    
    isManager() {
        return this.currentUser && this.currentUser.role === 'manager';
    }
    
    isCustomer() {
        return this.currentUser && (!this.currentUser.role || this.currentUser.role === 'customer');
    }

    // Уведомления
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #2ed573, #1dd1a1)' : 'linear-gradient(135deg, #ff6b6b, #ee5a52)'};
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
}

// Создаем глобальный экземпляр аутентификации
window.auth = new Auth();

// Функции для форм
function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value
    };

    // Валидация
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        auth.showNotification('Заполните все поля!', 'error');
        return false;
    }
    
    if (formData.password.length < 6) {
        auth.showNotification('Пароль должен быть не менее 6 символов', 'error');
        return false;
    }

    try {
        auth.register(formData);
        return true;
    } catch (error) {
        auth.showNotification(error.message, 'error');
        return false;
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        auth.showNotification('Заполните все поля!', 'error');
        return false;
    }

    try {
        auth.login(email, password);
        return true;
    } catch (error) {
        auth.showNotification(error.message, 'error');
        return false;
    }
}