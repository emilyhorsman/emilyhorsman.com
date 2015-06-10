module.exports = {
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
