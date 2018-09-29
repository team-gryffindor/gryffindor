var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));

app.get('/*', function(req, res) {
  res.redirect('/');
});

app.get('/', function(req, res) {
  res.send('HELLO WORLD');
});

app.listen(80, function() {
  console.log('listening on port 3000!');
});
