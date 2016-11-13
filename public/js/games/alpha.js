module.exports = (function() {
    var _name = 'Alpha'
      , _isPlaying = false
      , _isGameOver = false
    ;

    function reset() {
        _isPlaying = false;
        _isGameOver = false;
        play();
    }

    function play() {
        _isPlaying = true;
        site.showWindow('.stage.window');
    }

    function isPaused() {
        return !_isPlaying;
    }

    function pause() {
        _isPlaying = false;
        site.showWindow('.pause.window');
    }

    log(util.format('%s starting...', _name), { level: 2 });

    // create a pause screen
    var items = [
        '<div class="flexi"><button class="btn btn-success">Play</button></div>'
      , '<div class="flexi">Item 2</div>'
      , '<div class="flexi">Item 3</div>'
      , '<div class="flexi">Item 4</div>'
      , '<div class="flexi">Item 5</div>'
    ];

    var w = document.createElement('section');
    w.className = 'pause window';
    w.innerHTML = util.format('<div class="flex flexc">%s</div>', items.join(''));
    document.body.appendChild(w);

    $('.stage.window button.btn-success').click(function() {
        pause();
    });

    $('.pause.window button.btn-success').click(function() {
        play();
    });

    return {
        name: _name
      , reset: reset
      , play: play
      , pause: pause
      , isPaused: isPaused
    };
})();
