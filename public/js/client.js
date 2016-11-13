window.jQuery = window.$ = require('jquery');
window.util = require('util');
window.loggerLevel = 2;
window.log = require('./lib/log');

$(document).ready(function() {
    var bootstrap = require('bootstrap/dist/js/bootstrap')
      , style = require('../../node_modules/bootstrap/dist/css/bootstrap.css')
    ;

    window.socket = io();
    window.site = require('./lib/site');

    site.load( require('dn-game-alpha').client );

    log('ready', { level: 2 });
});
