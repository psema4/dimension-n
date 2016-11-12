var fs = require('fs')
  , util = require('util')
//, key  = fs.readFileSync('ssl/server.key', 'utf8')
//, cert = fs.readFileSync('ssl/server.crt', 'utf8')
//, creds = { key: key, cert: cert }
  , express = require('express')
  , app = express()
  , http = require('http')
//, https = require('https')
  , httpServer = http.createServer(app)
//, httpsServer = https.createServer(creds, app)
//  , io = require('socket.io')(httpServer)
  , io = require('socket.io').listen(httpServer)
;

io.on('connection', function(client) {
    console.log('client connected');

    client.on('event', function(data) {
        console.log(util.inspect(data, null, 4));

        client.emit('event', { text: 'welcome', data: { } });
    });

    client.on('disconnect', function() {
        console.log('client disconnected');
    });
});

app.set('port', (process.env.PORT || 5000));
//app.set('httpsPort', (process.env.HTTPSPORT || 5001));
app.use(express.static(__dirname + '/public'));

httpServer.listen(app.get('port'), function() {
    console.log("Serving http on port " + app.get('port'));
});

/*
httpsServer.listen(app.get('httpsPort'), function() {
    console.log("Serving https on port " + app.get('httpsPort'));
});
*/
