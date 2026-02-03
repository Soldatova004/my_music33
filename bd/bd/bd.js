// db-vinyl.js
const VinylDB = {
  // 1. Пользователи (3НФ)
  users: [
    { id: 1, email: 'admin@vinyl.ru', password: 'admin123', name: 'Админ', role: 'admin' },
    { id: 2, email: 'user@mail.ru', password: 'user123', name: 'Иван', role: 'customer' }
  ],

  // 2. Категории пластинок (3-4 категории)
  categories: [
    { id: 1, name: 'Рок', description: 'Рок-винил' },
    { id: 2, name: 'Джаз', description: 'Джазовые пластинки' },
    { id: 3, name: 'Классика', description: 'Классическая музыка' },
    { id: 4, name: 'Отечественное', description: 'Советские и российские исполнители' }
  ],

  // 3. Виниловые пластинки (5-6 в каждой категории)
  products: [
    // Рок (id: 1)
    { 
      id: 1, 
      name: 'The Beatles - Abbey Road', 
      price: 3990, 
      categoryId: 1, 
      year: 1969,
      artist: 'The Beatles',
      condition: 'новый',
      image: 'beatles.jpg',
      description: 'Классический альбом на 180г виниле'
    },
    { id: 2, name: 'Pink Floyd - The Dark Side of the Moon', price: 4590, categoryId: 1, year: 1973, artist: 'Pink Floyd' },
    { id: 3, name: 'Led Zeppelin - IV', price: 4200, categoryId: 1, year: 1971, artist: 'Led Zeppelin' },
    { id: 4, name: 'Queen - A Night at the Opera', price: 3800, categoryId: 1, year: 1975, artist: 'Queen' },
    { id: 5, name: 'Nirvana - Nevermind', price: 3500, categoryId: 1, year: 1991, artist: 'Nirvana' },
    { id: 6, name: 'AC/DC - Back in Black', price: 3200, categoryId: 1, year: 1980, artist: 'AC/DC' },

    // Джаз (id: 2)
    { id: 7, name: 'Miles Davis - Kind of Blue', price: 4500, categoryId: 2, year: 1959, artist: 'Miles Davis' },
    { id: 8, name: 'John Coltrane - A Love Supreme', price: 4800, categoryId: 2, year: 1965, artist: 'John Coltrane' },
    { id: 9, name: 'Louis Armstrong - What a Wonderful World', price: 2900, categoryId: 2, year: 1967, artist: 'Louis Armstrong' },
    { id: 10, name: 'Ella Fitzgerald - Ella and Louis', price: 4200, categoryId: 2, year: 1956, artist: 'Ella Fitzgerald' },
    { id: 11, name: 'Frank Sinatra - My Way', price: 3600, categoryId: 2, year: 1969, artist: 'Frank Sinatra' },

    // Классика (id: 3)
    { id: 12, name: 'Чайковский - Лебединое озеро', price: 2800, categoryId: 3, year: 1876, artist: 'П.И. Чайковский' },
    { id: 13, name: 'Моцарт - Реквием', price: 3100, categoryId: 3, year: 1791, artist: 'В.А. Моцарт' },
    { id: 14, name: 'Бетховен - Симфония №9', price: 3400, categoryId: 3, year: 1824, artist: 'Л. ван Бетховен' },

    // Отечественное (id: 4)
    { id: 15, name: 'Владимир Высоцкий - Лучшее', price: 2500, categoryId: 4, year: 1980, artist: 'Владимир Высоцкий' },
    { id: 16, name: 'Браво - Дорога в облака', price: 2700, categoryId: 4, year: 1999, artist: 'Браво' },
    { id: 17, name: 'Кино - Группа крови', price: 3200, categoryId: 4, year: 1988, artist: 'Кино' },
    { id: 18, name: 'Алла Пугачёва - Зеркало души', price: 2300, categoryId: 4, year: 1977, artist: 'Алла Пугачёва' }
  ],

  // 4. Заказы
  orders: [],

  // 5. Элементы заказа (связь many-to-many)
  orderItems: [],

  // Методы API
  getProducts() {
    return this.products;
  },

  getProduct(id) {
    return this.products.find(p => p.id == id);
  },

  getCategory(id) {
    return this.categories.find(c => c.id == id);
  },

  getProductsByCategory(categoryId) {
    return this.products.filter(p => p.categoryId == categoryId);
  },

  // Поиск по артисту или названию
  searchVinyl(query) {
    return this.products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.artist.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Хиты продаж (первые 4 товара)
  getFeatured() {
    return this.products.slice(0, 4);
  },

  // Новинки (последние 4 товара)
  getNewArrivals() {
    return this.products.slice(-4);
  },

  // Создать заказ
  createOrder(userId, items, total) {
    const orderId = this.orders.length + 1;
    const order = {
      id: orderId,
      userId,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORDER-${orderId}`
    };
    
    this.orders.push(order);
    return order;
  },

  // Авторизация
  login(email, password) {
    return this.users.find(u => u.email === email && u.password === password);
  }
};

// Для использования в консоли и коде
window.VinylDB = VinylDB;
