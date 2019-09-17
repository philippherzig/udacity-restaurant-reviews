let version = 'v2'

let cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png',
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon-2x.png',
    'https://unpkg.com/leaflet@1.3.1/dist/images/marker-shadow.png'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches
        .open(version)
        .then(cache => cache.addAll(cacheFiles))
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches
        .match(event.request)
        .then(response => {
            if (response) {
                console.log("Request found in cache:")
                console.log(event.request)
                return response
            }
            console.log("Request not found in cache. Fetching:")
            console.log(event.request)
            return fetch(event.request)
        })
    )
})