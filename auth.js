// auth.js
class Auth {
    constructor() {
        this.currentUser = this.loadUser();
        this.updateAuthLinks();
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
                authLink.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
                authLink.href = 'dashboard.html';
                
                // Добавляем кнопку выхода
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = 'Выйти';
                logoutBtn.style.marginLeft = '1rem';
                logoutBtn.style.background = 'none';
                logoutBtn.style.border = '1px solid white';
                logoutBtn.style.color = 'white';
                logoutBtn.style.padding = '0.3rem 0.8rem';
                logoutBtn.style.borderRadius = '3px';
                logoutBtn.style.cursor = 'pointer';
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
                
                authLink.parentNode.appendChild(logoutBtn);
            } else {
                authLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
                authLink.href = 'login.html';
            }
        }
    }

    async register(userData) {
        const users = this.getUsers();
        
        // Проверяем, существует ли пользователь
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        // Добавляем нового пользователя
        users.push({
            ...userData,
            id: Date.now(),
            registrationDate: new Date().toISOString(),
            orders: []
        });

        localStorage.setItem('users', JSON.stringify(users));
        this.saveUser(userData);
        return userData;
    }

    async login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Неверный email или пароль');
        }

        this.saveUser(user);
        return user;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    isAdmin() {
        return this.currentUser && this.currentUser.email === 'admin@mmusic.com';
    }

    addOrder(order) {
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            
            users[userIndex].orders.push({
                ...order,
                id: Date.now(),
                date: new Date().toISOString(),
                status: 'pending'
            });

            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Создаем глобальный экземпляр аутентификации
window.auth = new Auth();

// Функции для форм
function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value
    };

    try {
        auth.register(formData);
        alert('Регистрация успешна!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message);
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        auth.login(email, password);
        
        if (auth.currentUser.email === 'admin@mmusic.com') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert(error.message);
    }
}
