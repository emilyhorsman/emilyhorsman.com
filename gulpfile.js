var paths = require('./paths');
var gulp  = require('gulp');

// Match postcss- and csswring + anything else that might pop up for
// CSS processing. See package.json. Remove gulp- and postcss- prefix from
// plugin names.
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', '*css*', 'autoprefixer-core'],
    replaceString: /^(gulp|postcss)(-|\.)/
});

var log = function(err) {
    $.util.log($.util.colors.red('Error'), err.message);
};

var production = process.env.NODE_ENV === 'production';

// Copy static files from source to destination.
var resources = function(src, dest) {
    return gulp.src(src).pipe(gulp.dest(dest));
};

// Run all stylesheets through postcss processors and concat them together.
// Optionally create a sourcemap. gulp-cached is used to avoiding processsing
// unchanged files.
gulp.task('css', function() {
    var processors = [
        $.autoprefixerCore(),
        $.nested(),
        $.mixins(),
        $.simpleVars()
        ];
    if (production) processors.push($.csswring());
    return gulp.src(paths.src.css)
        .pipe($.cached('css'))
        .pipe($.if(!production, $.sourcemaps.init()))
        .pipe($.concat(paths.concat.css))
        .pipe($.postcss(processors))
        .on('error', log)
        .pipe($.if(!production, $.sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dest.css))
});

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
gulp.task('default', ['watch']);
