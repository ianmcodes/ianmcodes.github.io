/*jshint esnext: true, browser: true, devel: true, worker: true*/
/*globals caches*/
var self = this;
var CACHENAME = "codes-ianmccall-v7";
var precache = [
    '/',
    '/?utm_source=homescreen',
    '/assets/icons/ianmcodes_logo/maskable_icon_x512.png',
    '/assets/icons/ianmcodes_logo/maskable_icon_x192.png',
    '/assets/images/banner.jpg',
    '/css/main-1024.css',
    '/css/main-1440.css',
    '/css/main-4k.css',
    '/css/syntax.css',
    '/css/octicons/octicons.css',
    '/css/octicons/octicons.woff',
    '/css/repo_list.css',
    '/js/swinit.js',
    '/js/deferstyles.js',
    '/assets/images/IanMcCallCodes-logo/vector/default.svg',
];

self.addEventListener('install', function(event) {
    console.log(CACHENAME);
    event.waitUntil(
        caches.open(CACHENAME).then(function(cache) {
            return cache.addAll(precache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cachenames) {
            return Promise.all(
                cachenames.map(function(cachename) {
                    if(cachename != CACHENAME) {
                        return caches.delete(cachename);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);
    if(url.origin !== location.origin) {
        return;
    }
    // if(url.origin === location.origin && url.pathname.match(/^\/assets\/icons/)) {
    //     event.respondWith(handleIcon(event));
    //     return;
    // }
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if(!!response) {
                return response;
            }
            return fetch(event.request)
            .then((response) => {
                let respClone = response.clone();
                caches.open(CACHENAME)
                .then((cache) => {
                    cache.put(event.request, respClone);
                });
                return response;
            });
        })
    );
});

function handleIcon(event) {
    var netfetch = fetch(event.request);
    event.waitUntil(
        netfetch.then(function(response) {
            var respClone = response.clone();
            caches.open(CACHENAME)
            .then(function(cache) {
                cache.put(event.request,respClone);
            });
            return response;
        })
    );
    
    return caches.match(event.request).then(function(response) {
        if(!!response) {
            return response;
        }
        return netfetch;
    });
}
