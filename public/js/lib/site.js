module.exports = (function() {
    var _state = 0;

    function getState() { return _state; }
    function setState(s) { _state = s; return _state; }

    function hideWindows() { $('.window').hide(); }
    function showWindow(s) { hideWindows(); $(s).show(); }

    function load(game) {
        window.game = game;

        $('#game_name').text(game.name);
        $('#game_description').text(game.description);

        for (var i=0; i< game.screenshots.length; i++) {
            var url = game.screenshots[i];
            $('#slide' + (i+1))[0].src = url;
        }
    }

    // ---- setup site ui ----

    // `+-- debug window: ping
    $('.debug.window button.btn-primary').click(function() {
        socket.emit('event', { text: 'ping', data: { } });
    });

    // `+-- debug window: close
    $('.debug.window button.btn-default').click(function() {
        var s = (game.isPlaying() && game.isPaused()) ? '.pause.window' :
                (game.isPlaying()) ? '.stage.window' :
                '.home.window'
        ;

        showWindow(s);
    });

    // `+-- stage window: debug
    $('.stage.window button.btn-primary').click(function() {
        showWindow('.debug.window');
    });

    // `+-- stage window: close
    $('.stage.window button.btn-default').click(function() {
        game.quit();
    });

    // `+-- home window: debug
    $('.home.window button.btn-default').click(function() {
        showWindow('.debug.window');
    });

    // `+-- home window: play
    $('.home.window button.btn-primary').click(function() {
        showWindow('.user.window');
    });

    // `+-- user window: play
    $('.user.window button.btn-success').click(function() {
        socket.emit('event', { command: 'nick', data: { username: $('#username').value } });
        game.reset();
    });


    // ---- setup site comms ----
    socket.on('connect', function() { log('connected to socket server', { level: 2 }); });
    socket.on('disconnect', function() { log('disconnected from socket server', { level: 2 }); });
    socket.on('event', function(data) { log(data); if (data.data.username) { $('#username')[0].value = data.data.username; } });


    // --- site is ready ---
    socket.emit('event', { command: 'register', data: { } });
    showWindow('.home.window');

    return {
        getState: getState
      , setState: setState
      , hideWindows: hideWindows
      , showWindow: showWindow
      , load: load
    };
})();
