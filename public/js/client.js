window.loggerLevel = 3; // max log level, will display logging messages at this
                        // level or below, see log() for more details

/* log(string [, object]);
 *
 * optional object should provide an integer "level" that should be one of:
 *      1: log (default)
 *      2: warn
 *      3: error
*/
window.log = function(msg, opts) {
    opts = opts || {};
    opts.level = opts.level || 1;

    var logFn = 'log';

    switch(opts.level) {
        case 2:
            logFn = 'warn';
            break;

        case 3:
            logFn = 'error';
            break;

        case 1:
        default:
            logFn = 'log';
    }

    if (opts.level <= loggerLevel) {
        if (typeof console[logFn] === 'function') {
            console[logFn](msg);
        }
    }
}

window.addEventListener('load', function() {
    log('loaded', { level: 1 });


    // --- socket.io tests ---
    window.socket = io('http://localhost:5000');
    socket.on('connect', function(){ log('connected to socket server'); });
    socket.on('event', function(data){ log('server event caught'); console.log(data); });
    socket.on('disconnect', function(){ log('disconnected from socket server'); });


    // --- jquery, bootstrap tests ---
    window.jQuery = $ = require('jquery');

    var bootstrap = require('bootstrap/dist/js/bootstrap');
    var style = require('../../node_modules/bootstrap/dist/css/bootstrap.css');

    var popover = document.createElement('span');
    popover.innerHTML = 'I have a popover';
    document.body.appendChild(popover);

    $(popover).popover({ content: 'I am popover text' });
});
