'use strict';

const elixir = require('laravel-elixir');

require('laravel-elixir-eslint');

require('./tasks/bower.task.js');

// setting assets paths
elixir.config.assetsPath = './';
elixir.config.css.folder = 'angular';
elixir.config.css.sass.folder = 'angular';
elixir.config.js.folder = 'angular';

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

 let assets = [
         'public/js/final.js',
         'public/css/final.css'
     ],
     scripts = [
         'public/js/vendor.js', './semantic/dist/semantic.js', 'public/js/app.js'
     ],
     styles = [
         // for some reason, ./ prefix here works fine!
         // it is needed to override elixir.config.css.folder for styles mixin
         './semantic/dist/semantic.css', './public/css/vendor.css', './public/css/app.css'
     ];

elixir(mix => {
    mix.bower()
       .copy('angular/app/**/*.html', 'public/views/app/')
       .copy('angular/dialogs/**/*.html', 'public/views/dialogs/')
       .copy('semantic/dist/themes/default/assets/**/*.*', 'public/build/css/themes/default/assets/')
       .webpack('index.main.js', 'public/js/app.js')
       .sass(['**/*.scss', 'critical.scss'], 'public/css')
       .sass('critical.scss', 'public/css/critical.css')
       .styles(styles, 'public/css/final.css')
       .eslint('angular/**/*.js')
       .combine(scripts, 'public/js/final.js')
       .version(assets)
});
