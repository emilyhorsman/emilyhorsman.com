var gulp         = require('gulp');
var jade         = require('gulp-jade');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer-core');
var csswring     = require('csswring');
var nested       = require('postcss-nested');
var mixins       = require('postcss-mixins');
var vars         = require('postcss-simple-vars');

var paths = {
    src: {
        css: 'css/*.css',
        markup: 'markup/*.jade'
    },
    dest: {
        css: 'dist/css',
        markup: 'dist/'
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

gulp.task('css', function() { css(true); });
gulp.task('css:production', function() { css(false, [ csswring() ]); });

gulp.task('markup', function() {
    gulp.src(paths.src.markup)
        .pipe(jade())
        .pipe(gulp.dest(paths.dest.markup));
});

gulp.task('watch', function() {
    gulp.watch(paths.src.css, ['css']);
    gulp.watch(paths.src.markup, ['markup']);
});

gulp.task('default', ['watch']);
