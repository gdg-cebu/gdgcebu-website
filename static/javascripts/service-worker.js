var cacheName = 'cache-v1';
var urlsToCache = [
    '/',
    '/events',
    '/team',
    '/static/stylesheets/base.css',
    '/static/stylesheets/utilities.css',
    '/static/stylesheets/about.css',
    '/static/stylesheets/events.css',
    '/static/stylesheets/team.css',
    '/static/javascripts/base.js',
    '/static/javascripts/events.js',
    '/static/vendor/jquery/dist/jquery.min.js',
    '/static/manifest.json',
    '/static/images/backgrounds/1.jpg',
    '/static/images/backgrounds/2.jpg',
    '/static/images/backgrounds/3.jpg',
    '/static/images/events/io2016.png',
    '/static/images/events/wtm.png',
    '/static/images/team/arnelle.jpg',
    '/static/images/team/ayrton.jpg',
    '/static/images/team/cheer.jpg',
    '/static/images/team/emelie.jpg',
    '/static/images/team/frances.jpg',
    '/static/images/team/john.jpg',
    '/static/images/team/julia.jpg',
    '/static/images/team/kim.jpg',
    '/static/images/team/mark.jpg',
    '/static/images/team/rome.jpg',
    '/static/images/team/shad.jpg',
    '/static/images/calendar.png',
    '/static/images/facebook.png',
    '/static/images/gdg-cebu-logo.png',
    '/static/images/gdg-logo-gray.png',
    '/static/images/gdg-logo.png',
    '/static/images/github.png',
    '/static/images/location.png',
    '/static/images/twitter.png',
    '/static/images/website.png'
];


self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(urlsToCache);
        }).then(function() {
            self.skipWaiting();
        }).catch(function(error) {
            console.error('Error in service worker caching.', error);
        })
    );
});


self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(cacheKeys) {
            return Promise.all(cacheKeys.map(function(cacheKey) {
                if (cacheKey !== cacheName) {
                    return caches.delete(cacheKey);
                }
            }));
        }).catch(function(error) {
            console.error('Error getting cache keys.', error);
        })
    );
});


self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.open(cacheName).then(function(cache) {
            return cache.match(e.request).then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(e.request).catch(function(error) {
                    if (/\/get\-events$/.test(e.request.url)) {
                        return new Response('[]');
                    }
                });
            });
        }).catch(function(error) {
            console.error('Error opening cache.', error);
        })
    );
});


self.addEventListener('push', function(e) {
    var notification = e.data ? e.data.json() : {
        title: 'GDG Cebu',
        body: 'We have an update!',
        icon: '/static/images/gdg-logo.png'
    };
    e.waitUntil(
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: notification.icon
        })
    );
});


self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    e.waitUntil(self.clients.openWindow('/'));
});
