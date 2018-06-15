require.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': 'lib/jquery-3.3.1.min',
        'text': 'lib/text',
    },
    shim: {
        jquery: {
            exports: '$',
        }
    }
});
require(['main', 'jquery', 'text'], function (main, $) {
    main.Main();
});
//# sourceMappingURL=config.js.map