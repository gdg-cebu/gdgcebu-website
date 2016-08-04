var express = require('express');
var router = new express.Router();


router.get('/', function(request, response) {
    response.render('about.html');
});


router.get('/events', function(request, response) {
    response.render('events.html');
});


module.exports = router;
