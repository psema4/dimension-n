var serverEnv = process.env.SERVER_ENV && process.env.SERVER_ENV.match(/^prod/i) ? 'prod' : 'stage'

  , fs = require('fs')
  , util = require('util')

  , config = require('./config')
  , statusCodes = require('./lib/status-codes')

  , express = require('express')
  , session = require("express-session")({
        secret: config.secret
      , resave: true
      , saveUninitialized: true
      , cookie: {
            maxAge: 60000
        }
    })

  , http = require('http')
  , insecureApp = express()
  , httpServer = http.createServer(insecureApp)

  , https = require('https')
  , httpsOpts = {
        key: fs.readFileSync('ssl/server.key', 'utf8')
      , cert: fs.readFileSync('ssl/server.crt', 'utf8')
      , requestCert: serverEnv === 'prod'
      , rejectUnauthorized: serverEnv === 'prod'
    }
  , app = express()
  , httpsServer = https.createServer(httpsOpts, app)

  , io = require('socket.io')(httpsServer)
  , sharedsession = require("express-socket.io-session")
  , UUID = require('node-uuid')

  , game = require(config.moduleName)
  , assetsPath = util.format('%s/node_modules/%s/assets', __dirname, config.moduleName)
;


/*-----------------.
 | INSECURE SERVER |--------------------------------------------------------
 `-----------------' redirect all http requests to the secure game server */

insecureApp.set('port', (process.env.PORT || 5000));

insecureApp.all('*', function(req, res) {
    var httpsPort = process.env.HTTPSPORT || 5001;
    res.redirect(301, 'https://' + req.hostname + ':' + httpsPort + req.originalUrl);
});

httpServer.listen(insecureApp.get('port'), function() {
    console.log("Serving http on port " + insecureApp.get('port'));
});





/*---------------.
 | SECURE SERVER |----------------------------------------------------------
 `---------------' game server on https                                   */

app.use(function(req, res, next) {
    req.__st = new Date();

    res.on('finish', function() {
        console.log('%s %s %s %s (%sms)', new Date().toLocaleString(), res.statusCode, statusCodes[res.statusCode], req.originalUrl, (new Date() - req.__st));
    });

    next();
});

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

app.set('port', (process.env.HTTPSPORT || 5001));
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

httpsServer.listen(app.get('port'), function() {
    console.log("Serving https on port " + app.get('port'));
});
