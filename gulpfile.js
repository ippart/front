const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = true;

gulp.task('styles', () => {
    return gulp.src('src/styles/*.scss')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['node_modules', 'node_modules/motion-ui/src']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(dev, $.sourcemaps.write()))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
    return gulp.src('src/scripts/**/*.js')
        .pipe($.plumber())
        .pipe(webpackStream(require('./webpack.js'), webpack))
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(reload({stream: true}));
});

gulp.task('scripts:lib', () => {
    return gulp.src('src/scripts/**/*.js')
        .pipe($.plumber())
        .pipe($.if(dev, $.sourcemaps.init()))
        .pipe($.babel())
        .pipe($.if(dev, $.sourcemaps.write('.')))
        .pipe(gulp.dest('.tmp/scripts'))
        .pipe(reload({stream: true}));
});

function lint(files) {
    return gulp.src(files)
        .pipe($.eslint({fix: true}))
        .pipe(reload({stream: true, once: true}))
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
    return lint('src/scripts/**/*.js')
        .pipe(gulp.dest('src/scripts'));
});
gulp.task('lint:test', () => {
    return lint('test/spec/**/*.js')
        .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {
    return gulp.src('src/*.html')
        .pipe($.useref({searchPath: ['.tmp', 'src', '.']}))
        .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
        .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
        .pipe($.if(/\.html$/, $.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: {compress: {drop_console: true}},
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        })))
        .pipe(gulp.dest('build'));
});

gulp.task('images', () => {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('build/images'));
});

gulp.task('extras', () => {
    return gulp.src([
        'src/*',
        '!src/*.html',
        '.tmp/**/*'
    ], {
        dot: true
    }).pipe(gulp.dest('build'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'build']));

gulp.task('serve', () => {
    runSequence(['clean'], ['styles', 'scripts'], 'html' , () => {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['.tmp', 'build', 'src']
            }
        });

        gulp.watch([
            'src/*.html',
            'src/images/**/*'
        ]).on('change', reload);
        gulp.watch('src/*.html', ['html']);
        gulp.watch('src/styles/**/*.scss', ['styles']);
        gulp.watch('src/scripts/**/*.js', ['scripts']);
    });
});

gulp.task('serve:build', ['default'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['build']
        }
    });
});

gulp.task('serve:test', ['scripts'], () => {
    browserSync.init({
        notify: false,
        port: 9000,
        ui: false,
        server: {
            baseDir: 'test',
            routes: {
                '/scripts': '.tmp/scripts',
            }
        }
    });

    gulp.watch('src/scripts/**/*.js', ['scripts']);
    gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
    gulp.watch('test/spec/**/*.js', ['lint:test']);
});

gulp.task('build', [], (resolve) => {
    runSequence(['scripts', 'styles', 'html', 'images'], 'extras', resolve);
});

gulp.task('default', () => {
    return new Promise(resolve => {
        dev = false;
        runSequence(['clean'], 'build', resolve);
    });
});
