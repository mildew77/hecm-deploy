var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/price', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/price/index.html'));
});
app.get('/pooling', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/pooling/index.html'));
});
app.get('/bid', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/bid/index.html'));
});
app.use(express.static(__dirname + '/public'));
console.log('Listening on localhost:8080')
app.listen(8080);