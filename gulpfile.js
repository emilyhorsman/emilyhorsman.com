var gulp         = require('gulp');
var util         = require('gulp-util');
var jade         = require('gulp-jade');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var concat       = require('gulp-concat');
var entities     = require('gulp-entity-convert');
var autoprefixer = require('autoprefixer-core');
var csswring     = require('csswring');
var nested       = require('postcss-nested');
var mixins       = require('postcss-mixins');
var vars         = require('postcss-simple-vars');

var log = function(err) {
    util.log(util.colors.red('Error'), err.message);
};

var paths = {
    src: {
        css: 'css/*.css',
        markupwatch: 'markup/*',
        markup: 'markup/!(_)*.jade',
        images: 'images/**/*',
        icons: 'icons/**/*'
    },
    dest: {
        css: 'dist/css/',
        markup: 'dist/',
        images: 'dist/images/',
        icons: 'dist/'
    },
    concat: {
        css: 'all.css'
    }
};

var css = function(use_sourcemap, extra) {
    extra = extra || [];
    var processors = [ autoprefixer(), nested(), mixins(), vars() ].concat(extra);
    var g = gulp.src(paths.src.css);
    if (use_sourcemap)
        return g.pipe(sourcemaps.init())
                .pipe(concat(paths.concat.css))
                .pipe(postcss(processors)).on('error', log)
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest(paths.dest.css));
    else
        return g.pipe(concat(paths.concat.css))
                .pipe(postcss(processors)).on('error', log)
                .pipe(gulp.dest(paths.dest.css));
};

var resources = function(src, dest) {
    return gulp.src(src)
        .pipe(dest)
        .pipe(gulp.dest(dest));
};

gulp.task('css', function() { css(true); });
gulp.task('css:production', function() { css(false, [ csswring() ]); });

gulp.task('markup', function() {
    gulp.src(paths.src.markup)
        .pipe(jade()).on('error', log)
        // Convert unicode characters (e.g. not <>, etc) to HTML entities
        .pipe(entities())
        .pipe(gulp.dest(paths.dest.markup));
});

gulp.task('images', function () { resources(paths.src.images, paths.dest.images) });
gulp.task('icons', function() { resources(paths.src.icons, paths.dest.icons) });

gulp.task('watch', function() {
    gulp.watch(paths.src.css, ['css']);
    gulp.watch(paths.src.markupwatch, ['markup']);
    gulp.watch(paths.src.images, ['images']);
});

gulp.task('default', ['watch']);
