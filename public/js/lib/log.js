 module.exports = function(msg, opts) {
    opts = opts || {};
    opts.level = opts.level || 1;
    opts.class = opts.class || 'log';

    if (opts.level <= loggerLevel) {
        if (typeof console[opts.class] === 'function') {
            var args = [msg]
              , textarea = $('.debug.window textarea')[0]
            ;

            if (opts.args) {
                opts.args.map(function(i) {  args.push(i); });
            }

            if (args.length === 1) {
                args = args[0];
            }

            textarea.value += util.format(args) + "\n";
            textarea.scrollTop = textarea.scrollHeight;

            console[opts.class](args);
        }
    }
};
