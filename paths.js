module.exports = {
    watch: {
        css: 'css/*',
        markup: 'markup/*'
    },
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
    },
    concat: {
        css: 'all.css'
    }
};
