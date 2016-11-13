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
  , UUID = require('node-uuid')
  , config = require('./config')
  , game = require(config.moduleName)
  , assetsPath = util.format('%s/node_modules/%s/assets', __dirname, config.moduleName)
;

io.on('connection', function(client) {
    var clientId = UUID();
    console.log('client %s connected', clientId);

    client.on('event', function(data) {
        var res = game.server.onData(data);

        if (res) {
            client.emit('event', res);
        }
    });

    client.on('disconnect', function() {
        console.log('client disconnected');
    });

    client.emit('event', { command: 'register', data: { clientId: clientId } });
});

app.set('port', (process.env.PORT || 5000));
//app.set('httpsPort', (process.env.HTTPSPORT || 5001));
app.use(express.static(__dirname + '/public'));

app.get('/game/name', function(req, res) { res.status(200).send(game.server.name); });
app.get('/game/description', function(req, res) { res.status(200).send(game.server.description); });
app.get('/game/version', function(req, res) { res.status(200).send(game.server.version); });

// create endpoints for the game screenshots
[].forEach.call(game.server.screenshots, function(screenshot) {
    var urlFragment = screenshot.url
      , path = util.format('%s/node_modules/%s/%s', __dirname, config.moduleName, screenshot.path)
    ;

    app.get(urlFragment, function(req, res) {
        res.status(200).sendFile(path);
    });
});

app.use('/game/assets', express.static(assetsPath));

// ---- start the server(s)
httpServer.listen(app.get('port'), function() {
    console.log("Serving http on port " + app.get('port'));
});

/*
httpsServer.listen(app.get('httpsPort'), function() {
    console.log("Serving https on port " + app.get('httpsPort'));
});
*/
