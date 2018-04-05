(function () {
    'use strict'

    var CACHE_SHELL = 'pwa-news-shell-v1';
    var CACHE_DATA = 'pwa-news-data-v1';
    var API = 'https://newsapi.org/v2/';
    var FILES_SHELL = [
        '/',
        '/css/main.css',
        '/css/materialize.min.css',
        '/image/placeholder-image.png',
        '/js/api.js',
        '/library/jquery-3.2.1.min.js',
        '/library/materialize.min.js',
        '/library/moment.min.js'
    ];

    self.addEventListener('install', function (event) {
        event.waitUntil(
            self.caches.open(CACHE_SHELL)
                .then(function (cache) {
                    return cache.addAll(FILES_SHELL);
                })
        )
    });

    self.addEventListener('activate', function (event) {
        var cacheWhitelist = [CACHE_SHELL, CACHE_DATA];
        event.waitUntil(
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    });


    self.addEventListener('fetch', function (event) {
        if (event.request.url.indexOf(API) === -1) {
            event.respondWith(
                caches.match(event.request)
                    .then(function (response) {
                        if (response) {
                            return response;
                        } return fetch(event.request);
                    })
            )
        } else {
            event.respondWith(
                self.fetch(event.request)
                    .then(function (response) {
                        return caches.open(CACHE_DATA)
                            .then(function (cache) {
                                cache.put(event.request.url, response.clone());
                                return response;
                            })
                    })
                    .catch(function (err) {
                        return caches.match(event.request);
                    })
            )
        }
    });


}());