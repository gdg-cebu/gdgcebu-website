var express = require('express');
var firebase = require('firebase');
var webpush = require('web-push');
var config  = require('./config');

var router = new express.Router();


firebase.initializeApp({
    databaseURL: config.get('FIREBASE_DATABASE_URL')
});
var database = firebase.database();

webpush.setGCMAPIKey(config.get('GCM_API_KEY'));


router.use(function(request, response, next) {
    response.locals.currentPath = function(path, success) {
        var current = request.url.replace(/\?.*$/, '');
        return (current === path || current === path + '/') ? success : '';
    };
    next();
});


router.get('/', function(request, response) {
    response.render('about.html');
});


router.get('/events', function(request, response) {
    response.render('events.html');
});


router.get('/team', function(request, response) {
    response.render('team.html');
})


router.get('/get-events', function(request, response) {
    var eventsref = database.ref('events');
    eventsref.on('value', function(data) {
        eventsref.off('value');
        var events = data.val().filter(function(event) {
            return event !== null;
        }).sort(function(a, b) {
            var datea = new Date(a.date);
            var dateb = new Date(b.date);
            return dateb.valueOf() - datea.valueOf();
        });
        response.json(events);
    });
});


router.post('/subscribe', function(request, response) {
    database.ref('subscriptions').push(request.body.subscription);
    response.status(200).end();
});


router.post('/broadcast', function(request, response) {
    var notification = {
        title: request.body.title,
        body: request.body.body,
        icon: request.body.icon
    };
    var subscriptionsref = database.ref('subscriptions');
    subscriptionsref.on('value', function(data) {
        subscriptionsref.off('value');
        data = data.val();
        if (!data) {
            return null;
        }
        Object.keys(data).forEach(function(key) {
            var subscription = data[key];
            webpush.sendNotification(subscription.endpoint, {
                userPublicKey: subscription.keys.p256dh,
                userAuth: subscription.keys.auth,
                payload: JSON.stringify(notification)
            });
        });
    });
    response.status(200).end();
});


module.exports = router;
