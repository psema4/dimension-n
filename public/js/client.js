window.loggerLevel = 2; // max log level, will display logging messages at this
                        // level or below, see log() for more details

var util = require('util');

/* log(string [, object]);
 *
 * optional object should provide an integer "level"
 *      1. log (default)
 *      2. notice
 *      3. ...
 *
 * optional object can provide the message "class"
 *      1. log (default)
 *      2. warn
 *      3. error
*/
window.log = function(msg, opts) {
    opts = opts || {};
    opts.level = opts.level || 1;
    opts.class = opts.class || 'log';

    // FIXME: make jquery global earlier, or define this fn later
    var $ = function(s) { return document.querySelectorAll(s); };

    if (opts.level <= loggerLevel) {
        if (typeof console[opts.class] === 'function') {
            var args = [msg];

            if (opts.args) {
                opts.args.map(function(i) {  args.push(i); });
            }

            console[opts.class].apply(this, args);

            if (args.length === 1) {
                args = args[0];
            }
            $('.debug.window textarea')[0].value += util.format(args) + "\n";
        }
    }
}

window.addEventListener('load', function() {
    log('loaded', { level: 2 });

    window.appState = 0;

    window.jQuery = $ = require('jquery');
    window.socket = io('http://localhost:5000');

    var bootstrap = require('bootstrap/dist/js/bootstrap')
      , style = require('../../node_modules/bootstrap/dist/css/bootstrap.css')
    ;

    window.showDebug = function() {
        $('.debug.window').show();
        $('.home.window').hide();
        $('.stage.window').hide();
    };

    $('.debug.window button.btn-primary').click(function() {
        socket.emit('event', { text: 'ping', data: {} });
    });

    $('.debug.window button.btn-default').click(function() {
        $('.debug.window').hide();
        $('.home.window').hide();
        $('.stage.window').hide();

        w = (window.appState === 0) ? $('.home') : $('.stage');
        w.show();
    });

    $('.stage.window button.btn-primary').click(function() {
        $('.debug.window').show();
        $('.home.window').hide();
        $('.stage.window').hide();
    });

    $('.stage.window button.btn-default').click(function() {
        $('.debug.window').hide();
        $('.home.window').show();
        $('.stage.window').hide();
    });

    $('.home button').click(function() {
        $('.debug.window').hide();
        $('.home.window').hide();
        $('.stage.window').show();

        window.appState = 1;
    });


    socket.on('connect', function() { log('connected to socket server', { level: 2 }); });
    socket.on('disconnect', function() { log('disconnected from socket server', { level: 2 }); });
    socket.on('event', function(data) { log(data); });

    socket.emit('event', { text: 'hello', data: {} });
    $('.loading.window').hide();
    $('.home.window').show();
});
