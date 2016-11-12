var util = require('util')
  , express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
;

io.on('connection', function(client) {
    console.log('client connected');

    client.on('event', function(data) {
        console.log(util.inspect(data, null, 4));

        client.emit('event', { text: 'welcome', data: { a: 4, b: 5, c: 6 } });
    });

    client.on('disconnect', function() {
        console.log('client disconnected');
    });
});

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function() {
    console.log("Server is running at localhost:" + app.get('port'));
});
