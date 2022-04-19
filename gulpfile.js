const { src, dest, series, watch } = require('gulp');

const concat = require('gulp-concat');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const image = require('gulp-image');
const sass = require('gulp-sass')(require('sass'));
const fs = require('fs');
const htmlmin = require('gulp-htmlmin');

const fonts = () => {
	src('./src/fonts/**.ttf')
		.pipe(ttf2woff())
		.pipe(dest('./app/fonts/'))
	return src('./src/fonts/**.ttf')
		.pipe(ttf2woff2())
		.pipe(dest('./app/fonts/'))
}

const svgSprites = () => {
  return src('./src/img/svg/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprites.svg'
        }
      }
    }))
    .pipe(dest('./app/img'))
}

const styles = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./app/css/'))
		.pipe(browserSync.stream());
}

const htmlInclude = () => {
  return src(['./src/*.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./app'))
    .pipe(browserSync.stream())
}

const imgToApp = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/**.ico'])
    .pipe(dest('./app/img'))
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}

const clean = () => {
  return del(['app/*'])
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/libraries/**/*.js',
    'src/js/main.js',
  ])
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        }]
      }
    }))
    .on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end');
		})
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream())
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./app"
    }
  });
  watch('./src/scss/**/*.scss', styles);
  watch('./src/*.html', htmlInclude);
  watch('./src/img/**.jpg', imgToApp);
  watch('./src/img/**.png', imgToApp);
  watch('./src/img/**.jpeg', imgToApp);
  watch('./src/img/**.svg', svgSprites);
  watch('./src/resources/**', resources);
  watch('./src/fonts/**.ttf', fonts);
  watch('./src/js/**/*.js', scripts);
}

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.fileinclude = htmlInclude;

exports.default = series(clean, htmlInclude, scripts, fonts, resources, imgToApp, svgSprites, styles, watchFiles)


// ================= BUILD =================
const stylesBuild = () => {
  return src('./src/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(rename({
			suffix: '.min'
		}))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js',
  ])
    .pipe(webpackStream({
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: "defaults" }]
              ]
            }
          }
        }]
      }
    }))
    .on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end');
		})
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('./app/js'))
}

const imgToAppBuild = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/**/*.jpeg',
  ])
  .pipe(image())
  .pipe(dest('./app/img'))
}

const htmlMinify = () => {
  return src(`./src/**/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'));
}


exports.build = series(clean, htmlInclude, scriptsBuild, fonts, resources, imgToAppBuild, svgSprites, stylesBuild, htmlMinify)
