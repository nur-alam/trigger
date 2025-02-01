let mix = require('laravel-mix');
const path = require('path');
const tailwind = require('laravel-mix-tailwind');

mix.webpackConfig({
	cache: false,
});

mix.setPublicPath('./assets/dist');

mix.js('src/index.js', 'assets/dist/js/backend-bundle.min.js').react();

mix.js('assets/src/script/frontend/frontend.js', 'assets/dist/js/trigger-frontend.min.js');

mix.sass('assets/src/scss/index.scss', 'assets/dist/css/style.min.css').tailwind();

mix.alias({
	'@components': path.resolve(__dirname, './src/components/'),
	'@config': path.resolve(__dirname, './src/config/'),
	'@hooks': path.resolve(__dirname, './src/hooks/'),
	'@pages': path.resolve(__dirname, './src/pages/'),
	'@utils': path.resolve(__dirname, './src/utils/'),
	'@services': path.resolve(__dirname, './src/services/'),
});
