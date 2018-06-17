require.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': 'lib/jquery-3.3.1.min',
        'text': 'lib/text',
        'FileSaver': 'lib/FileSaver'
    },
    shim: {
        jquery: {
            exports: '$',
        }
    }
});
require(['main', 'jquery', 'text', 'FileSaver'], function (main, $, FileSaver) {
    main.Main();
});
//# sourceMappingURL=config.js.map