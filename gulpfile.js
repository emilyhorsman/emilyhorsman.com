var gulp  = require('gulp');
var paths = require('./paths');

// Match postcss- and csswring + anything else that might pop up for
// CSS processing. See package.json. Remove gulp- and postcss- prefix from
// plugin names.
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', '*css*', 'autoprefixer-core'],
    replaceString: /^(gulp|postcss)(-|\.)/
});

var log = function(err) {
    $.util.log(util.colors.red('Error'), err.message);
};

// Helper function for CSS tasks. Run all stylesheets through postcss
// processors and concat them together. Optionally create a sourcemap.
// gulp-cached is used to avoiding processsing unchanged files.
//
// https://github.com/postcss/postcss
// https://github.com/floridoo/gulp-sourcemaps
// https://github.com/wearefractal/gulp-concat
// https://github.com/wearefractal/gulp-cached
var css = function(use_sourcemap, extra) {
    // Base set of processors to use in development or production.
    var processors = [ $.autoprefixerCore(), $.nested(), $.mixins(), $.simpleVars() ].concat(extra || []);
    var g = gulp.src(paths.src.css).pipe($.cached('css'));
    if (use_sourcemap)
        return g.pipe($.sourcemaps.init())
                .pipe($.concat(paths.concat.css))
                .pipe($.postcss(processors)).on('error', log)
                .pipe($.sourcemaps.write('.'))
                .pipe(gulp.dest(paths.dest.css));
    else
        return g.pipe($.concat(paths.concat.css))
                .pipe($.postcss(processors)).on('error', log)
                .pipe(gulp.dest(paths.dest.css));
};

// Copy static files from source to destination.
var resources = function(src, dest) {
    return gulp.src(src).pipe(gulp.dest(dest));
};

gulp.task('css', function() { css(true); });
gulp.task('css:production', function() { css(false, [ $.csswring() ]); });

gulp.task('markup', function() {
    gulp.src(paths.src.markup)
        .pipe($.cached('markup'))
        .pipe($.jade()).on('error', log)

        // Convert unicode characters (e.g. not <>, etc) to HTML entities
        .pipe($.entityConvert())
        .pipe(gulp.dest(paths.dest.markup));
});

gulp.task('images', function () { resources(paths.src.images, paths.dest.images) });
gulp.task('icons', function() { resources(paths.src.icons, paths.dest.icons) });

gulp.task('watch', function() {
    gulp.watch(paths.src.css, ['css']);
    gulp.watch(paths.src.markupwatch, ['markup']);
    gulp.watch(paths.src.images, ['images']);
    gulp.watch(paths.src.icons, ['icons'])
});

gulp.task('all', ['images', 'icons', 'markup', 'css'])
gulp.task('all:production', ['images', 'icons', 'markup', 'css:production'])
gulp.task('default', ['watch']);
