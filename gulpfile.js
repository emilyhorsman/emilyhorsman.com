var gulp         = require('gulp');
var jade         = require('gulp-jade');
var postcss      = require('gulp-postcss');
var changed      = require('gulp-changed');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var csswring     = require('csswring');
var nested       = require('postcss-nested');
var mixins       = require('postcss-mixins');
var vars         = require('postcss-simple-vars');

var paths = {
    src: {
        css: 'css/*.css',
        markup: 'markup/!(_)*.jade',
        images: 'images/**/*',
        icons: 'icons/**/*'
    },
    dest: {
        css: 'dist/css/',
        markup: 'dist/',
        images: 'dist/images/',
        icons: 'dist/'
    }
};

var css = function(use_sourcemap, extra) {
    extra = extra || [];
    var processors = [ nested(), mixins(), vars() ].concat(extra);
    var g = gulp.src(paths.src.css);
    if (use_sourcemap)
        g.pipe(sourcemaps.init())
         .pipe(postcss(processors))
         .pipe(sourcemaps.write('.'));
    else
        g.pipe(postcss(processors));

    return g.pipe(gulp.dest(paths.dest.css));
};

var static = function(src, dest) {
    return gulp.src(src)
        .pipe(dest)
        .pipe(gulp.dest(dest));
};

gulp.task('css', function() { css(true); });
gulp.task('css:production', function() { css(false, [ csswring() ]); });

gulp.task('markup', function() {
    gulp.src(paths.src.markup)
        .pipe(changed(paths.dest.markup))
        .pipe(jade())
        .pipe(gulp.dest(paths.dest.markup));
});

gulp.task('images', function () { static(paths.src.images, paths.dest.images) });
gulp.task('icons', function() { static(paths.src.icons, paths.dest.icons) });

gulp.task('watch', function() {
    gulp.watch(paths.src.css, ['css']);
    gulp.watch(paths.src.markup, ['markup']);
    gulp.watch(paths.src.images, ['images']);
});

gulp.task('default', ['watch']);
