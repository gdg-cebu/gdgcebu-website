var express = require('express');
var firebase = require('firebase');
var config  = require('./config');

var router = new express.Router();


firebase.initializeApp({
    databaseURL: config.get('FIREBASE_DATABASE_URL')
});
var database = firebase.database();


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
        var events = data.val().filter(function(event) {
            return event !== null;
        }).sort(function(a, b) {
            var datea = new Date(a.date);
            var dateb = new Date(b.date);
            return datea.valueOf() - dateb.valueOf();
        });
        eventsref.off('value');
        response.json(events);
    });
});


module.exports = router;
