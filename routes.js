var express = require('express');
var router = new express.Router();


router.use(function(request, response, next) {
    response.locals.currentPath = function(path, success) {
        var current = request.url.replace(/\?.*$/, '');
        return current === path ? success : '';
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


module.exports = router;
