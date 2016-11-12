var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//app.get('/', function(request, response) { response.send('Hello from Node Knockout 2016!'); });

/* --------- disable fixed --------- */
/*
app.get('/', function(req, res){ res.sendfile('public/index.html'); });
app.get('/css/client.css', function(req, res){ res.sendfile('public/client.css'); });
app.get('/js/bundle.js', function(req, res){ res.sendfile('public/js/bundle.js'); });
app.get('/js/bundle.min.js', function(req, res){ res.sendfile('public/js/bundle.min.js'); });
*/
/* --------- disable fixed --------- */

io.on('connection', function(socket) {
    console.log('connection!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
