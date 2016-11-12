window.loggerLevel = 1; // max log level, will display logging messages at this
                        // level or below, see log() for more details

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

    if (opts.level <= loggerLevel) {
        if (typeof console[opts.class] === 'function') {
            var args = [msg];

            if (opts.args) {
                opts.args.map(function(i) {  args.push(i); });
            }

            console[logFn].apply(this, args);
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
        $('.debug').show();
        $('.home').hide();
        $('.stage').hide();
    };

    $('.debug button').click(function() {
        $('.debug').hide();
        $('.home').hide();
        $('.stage').hide();

        w = (window.appState === 0) ? $('.home') : $('.stage');
        w.show();
    });

    $('.home button').click(function() {
        $('.debug').hide();
        $('.home').hide();
        $('.stage').show();

        window.appState = 1;
    });


    socket.on('connect', function() { log('connected to socket server', { level: 2 }); });
    socket.on('disconnect', function() { log('disconnected from socket server', { level: 2 }); });

    socket.on('event', function(data) {
        console.log(data);
    });

    socket.emit('event', { text: 'hello', data: {} });
});
