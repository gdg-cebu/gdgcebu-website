var path = require('path');
var express = require('express');
var bodyparser = require('body-parser');
var consolidate = require('consolidate');
var morgan = require('morgan');
var winston = require('winston');
var config = require('./config');


var app = express();

app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.engine('html', consolidate.nunjucks);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.listen(config.get('PORT'), function() {
    winston.info('Server now running at port ' + config.get('PORT'));
});


app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/service-worker.js', express.static(
    path.join(__dirname, 'static', 'javascripts', 'service-worker.js')));
app.use('/', require('./routes'));
