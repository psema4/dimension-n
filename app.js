var fs = require('fs')
  , util = require('util')
  , config = require('./config')
//, key  = fs.readFileSync('ssl/server.key', 'utf8')
//, cert = fs.readFileSync('ssl/server.crt', 'utf8')
//, creds = { key: key, cert: cert }
  , express = require('express')
  , session = require("express-session")({
        secret: config.secret
      , resave: true
      , saveUninitialized: true
      , cookie: {
            maxAge: 60000
        }
    })
  , app = express()
  , http = require('http')
//, https = require('https')
  , httpServer = http.createServer(app)
//, httpsServer = https.createServer(creds, app)
//  , io = require('socket.io')(httpServer)
  , io = require('socket.io').listen(httpServer)
  , sharedsession = require("express-socket.io-session")
  , UUID = require('node-uuid')
  , game = require(config.moduleName)
  , assetsPath = util.format('%s/node_modules/%s/assets', __dirname, config.moduleName)
;

app.use(session);
io.use(sharedsession(session, { autoSave: true }));

io.on('connection', function(client) {
    var session = client.handshake.session
      , clientId = session.clientId || UUID()
      , username = session.username || 'guest_' + (Math.floor(Math.random() * 1000))
    ;

    if (!session.clientId) {
        client.handshake.session.clientId = clientId;
    }

    if (!session.username) {
        client.handshake.session.username = username;
    }

    console.log('client %s connected, session: %s', clientId, util.format(session));

    client.on('event', function(data) {
        var res = false;

        if (data.command === 'nick') {
            username = data.data.username;
            client.handshake.session.username = username;
            res = { command: 'namechange', data: { clientId: clientId, username: client.handshake.session.username } }

        } else {
            res = game.server.onData(data, client.handshake.session);
        }

        if (res) {
            client.emit('event', res);
        }
    });

    client.on('disconnect', function() {
        console.log('client disconnected');
    });

    client.emit('event', { command: 'welcome', data: { clientId: clientId } });
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
