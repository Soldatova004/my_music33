// sw.js - Service Worker для офлайн-работы

// Версия кэша (меняйте при обновлении сайта)
const CACHE_VERSION = 'vinyl-v1';
const CACHE_NAME = `vinyl-store-${CACHE_VERSION}`;

// Файлы которые нужно закэшировать для работы офлайн
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/catalog.html',
    '/cart.html',
    '/login.html',
    '/dashboard.html',
    '/admin.html',
    '/style.css',
    '/auth.js',
    '/cart.js',
    '/main.js',
    '/optimize.js'
];

// ===== 1. УСТАНОВКА =====
// Выполняется когда пользователь впервые заходит на сайт
self.addEventListener('install', event => {
    console.log('[Service Worker] Установка');
    
    // Ждем пока закэшируем все файлы
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Кэшируем файлы');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => {
                // Активируем сразу
                return self.skipWaiting();
            })
    );
});

// ===== 2. АКТИВАЦИЯ =====
// Выполняется когда Service Worker становится активным
self.addEventListener('activate', event => {
    console.log('[Service Worker] Активация');
    
    event.waitUntil(
        // Удаляем старые кэши
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Удаляем старый кэш:', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    
    // Становимся активными для всех вкладок
    return self.clients.claim();
});

// ===== 3. ПЕРЕХВАТ ЗАПРОСОВ =====
// Перехватываем все запросы к серверу
self.addEventListener('fetch', event => {
    // Пропускаем не-GET запросы и запросы к внешним сервисам
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('google-analytics')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Если есть в кэше - отдаем из кэша
                if (cachedResponse) {
                    console.log('[Service Worker] Из кэша:', event.request.url);
                    return cachedResponse;
                }
                
                // Иначе грузим с сервера
                console.log('[Service Worker] Загружаем:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        // Кэшируем успешные ответы
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return response;
                    })
                    .catch(error => {
                        // Если интернета нет - показываем офлайн-страницу
                        console.log('[Service Worker] Ошибка загрузки:', error);
                        return new Response(
                            '<h1>Вы офлайн</h1><p>Пожалуйста, проверьте подключение к интернету</p>',
                            { headers: { 'Content-Type': 'text/html' } }
                        );
                    });
            })
    );
});
