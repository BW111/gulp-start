const { src, dest, watch, parallel, series } = require( 'gulp' );

const scss              = require( 'gulp-sass' );
const concat            = require( 'gulp-concat' );
const browserSync       = require( 'browser-sync' ).create();
const uglify            = require( 'gulp-uglify-es' ).default;
const autoprefixer      = require('gulp-autoprefixer');
const imagemin          = require("gulp-imagemin");
const del               = require("del");




//<FUNCTION BROWSER SYNC>==========================BROWSER SYNC
function browsersync(){
    browserSync.init({
        server:{
            baseDir : 'app/'
        }
    });
}
//<FUNCTION BROWSER SYNC>==========================CLEAN DEST
function cleanDist(){
    return del('dist');
}
//<FUNCTION SCSS>=================================SCSS
function styles(){
    return src( 'app/scss/style.scss' )
        .pipe( autoprefixer({
            grid: true,
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }) )
        .pipe( scss({outputStyle: 'compressed'}) ) //expanded  //compressed
        .pipe( concat('style.min.css') )
        .pipe( dest('app/css') )
        .pipe( browserSync.stream() );
}
//<FUNCTION JAVASCRIPT>============================JAVASCRIPT
function scripts(){
    return src( ['app/js/main.js'] )
    .pipe( concat('main.min.js') )
    .pipe( uglify() )
    .pipe( dest('app/js') )
    .pipe( browserSync.stream() );
}
//<FUNCTION IMAGES>======================================IMAGES
function images(){
    return src('app/images/**/*')
        .pipe(imagemin())
        .pipe(dest('dist/images'))
}





//<BUILD>==========================
function build(){
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'], {base:'app'})
        .pipe(dest('dist'))
}
//<WATCHING>==========================
function watching(){
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js','!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel( styles, scripts, browsersync, watching );