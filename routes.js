var express = require('express');
var router = new express.Router();


router.get('/', function(request, response) {
    response.render('about.html');
});


module.exports = router;
