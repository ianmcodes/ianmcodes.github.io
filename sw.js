/*jshint esnext: true, browser: true, devel: true, worker: true*/
/*globals caches*/
var self = this;
var CACHENAME = "codes-ianmccall-v1";
var precache = [
    '/assets/images/banner.jpg',
    '/css/syntax.css',
    '/css/main.css',
    '/css/custom_icons.css',
    '/css/octicons/octicons.css',
    '/css/octicons/octicons.woff',
    '/css/repo_list.css',
    '/bower_components/jquery/dist/jquery.js',
    '/bower_components/underscore/underscore-min.js',
    '/js/swinit.js',
    '/css/home.css'
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
    if(url.origin === location.origin && url.pathname.match(/^\/assets\/icons/)) {
        event.respondWith(handleIcon(event));
        return;
    }
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if(!!response) {
                return response;
            }
            return fetch(event.request);
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
        })
    );
    
    return caches.match(event.request).then(function(response) {
        if(!!response) {
            return response;
        }
        return netfetch;
    });
}
