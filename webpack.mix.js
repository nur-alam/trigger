let mix = require('laravel-mix');
const path = require('path');
const tailwind = require('laravel-mix-tailwind');

mix.webpackConfig({
	cache: false,
});

mix.setPublicPath('./assets/dist');

// mix.sass('assets/src/scss/index.scss', 'assets/dist/css/style.min.css');

mix.sass('assets/src/scss/index.scss', 'assets/dist/css/style.min.css').tailwind();

// mix.alias({
// 	'@components': path.resolve(__dirname, './src/components/*'),
// 	'@utils': path.resolve(__dirname, './src/utils/*'),
// 	'@ui': path.resolve(__dirname, './src/components/ui/*'),
// 	'@lib': path.resolve(__dirname, './src/lib/*'),
// 	// '@config': path.resolve(__dirname, './src/config/'),
// 	// '@hooks': path.resolve(__dirname, './src/hooks/'),
// 	// '@pages': path.resolve(__dirname, './src/pages/'),
// 	// '@utils': path.resolve(__dirname, './src/utils/'),
// 	// '@services': path.resolve(__dirname, './src/services/'),
// });
