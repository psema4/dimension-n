module.exports = (function() {
    var _state = 0;

    function getState() { return _state; }
    function setState(s) { _state = s; return _state; }

    function hideWindows() { $('.window').hide(); }
    function showWindow(s) { hideWindows(); $(s).show(); }

    function load(game) {
        window.game = game;
        game.reset();
    }

    // ---- setup site ui ----

    // `+-- debug window: ping
    $('.debug.window button.btn-primary').click(function() {
        socket.emit('event', { text: 'ping', data: { } });
    });

    // `+-- debug window: close
    $('.debug.window button.btn-default').click(function() {
        var s = (_state === 0) ? '.home.window' : '.stage.window'
        showWindow(s);
    });

    // `+-- stage window: debug
    $('.stage.window button.btn-primary').click(function() {
        showWindow('.debug.window');
    });

    // `+-- stage window: close
    $('.stage.window button.btn-default').click(function() {
        showWindow('.home.window');
    });

    // `+-- home window: play
    $('.home button').click(function() {
        game.reset();
    });


    // ---- setup site comms ----
    socket.on('connect', function() { log('connected to socket server', { level: 2 }); });
    socket.on('disconnect', function() { log('disconnected from socket server', { level: 2 }); });
    socket.on('event', function(data) { log(data); });


    // --- site is ready ---
    socket.emit('event', { text: 'hello', data: { } });
    showWindow('.loading.window');
    showWindow('.home.window');

    return {
        getState: getState
      , setState: setState
      , hideWindows: hideWindows
      , showWindow: showWindow
      , load: load
    };
})();
