require.config({
	baseUrl: 'scripts',

	paths: {
		'jquery': 'lib/jquery-3.3.1.min',
	},

	shim: {
		jquery: {
			exports: '$'
		}
	},

	map: {
		"*.html" : {
			"*" : "*.html"
		}
	}
});

require(['main', 'jquery'], (main, $) => {
    main.Main();
}); 