/*
 * Note: for minifying and no watch notifications
 * NODE_ENV=production
 * DISABLE_NOTIFIER=true
 */

var paths = require('./paths');
var gulp  = require('gulp');

// Match postcss- and csswring + anything else that might pop up for
// CSS processing. See package.json. Remove gulp- and postcss- prefix from
// plugin names.
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', '*css*', 'autoprefixer-core', 'strip-ansi'],
    replaceString: /^(gulp|postcss)(-|\.)/
});

var production = process.env.NODE_ENV === 'production';

// Copy static files from source to destination.
var resources = function(src, dest) {
    return gulp.src(src).pipe(gulp.dest(dest));
};

// Monkey patch gulp.src to use gulp-plumber and gulp-notify
var err = function(err) {
    if (err.plugin === 'gulp-postcss') {
        // Remove most of the path and ANSI escape codes for readability.
        var e = err.message.replace(__dirname, '').split("\n");
        var title = e[0];
        var msg = $.stripAnsi(e.slice(1).join("\n"));
    } else {
        var title = err.plugin;
        var msg = err.message;
    }

    $.notify.onError({
        title: title,
        message: msg,
        sound: true,
        icon: false
    })(err);

    // postcss won't end unless we tell it. Without this future CSS changes
    // won't process.
    this.emit('end');
};

gulp._src = gulp.src;
gulp.src = function() {
    return gulp._src.apply(gulp, arguments).pipe($.plumber({ errorHandler: err }));
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
        // Sourcemap write path is relative to the destination.
        .pipe($.if(!production, $.sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dest.css))
});

gulp.task('markup', function() {
    gulp.src(paths.src.markup)
        .pipe($.cached('markup'))
        .pipe($.jade())

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
