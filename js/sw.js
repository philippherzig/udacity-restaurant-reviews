var VERSION = 'v1'

var cacheFirstFiles = [
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
    '/img/10.jpg'

]

var networkFirstFiles = []

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles)

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(VERSION).then(cache => {
            return cache.addAll(cacheFiles)
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') { return; }
    if (networkFirstFiles.indexOf(event.request.url) !== -1) {
        event.respondWith(networkElseCache(event))
    } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
        event.respondWith(cacheElseNetwork(event))
    }
    event.respondWith(fetch(event.request))
})

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork(event) {
    return caches.match(event.request).then(response => {
        function fetchAndCache() {
            return fetch(event.request).then(response => {
                // Update cache.
                caches.open(VERSION).then(cache => cache.put(event.request, response.clone()))
                return response
            })
        }

        // If not exist in cache, fetch.
        if (!response) { return fetchAndCache() }

        // If exists in cache, return from cache while updating cache in background.
        fetchAndCache();
        return response;
    });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache(event) {
    return caches.match(event.request).then(match => {
        if (!match) { return fetch(event.request) }
        return fetch(event.request).then(response => {
            // Update cache.
            caches.open(VERSION).then(cache => cache.put(event.request, response.clone()))
            return response
        }) || response
    })
}