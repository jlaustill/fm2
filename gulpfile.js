/* File: gulpfile.js */

// grab our gulp packages
var gulp = require("gulp"),
    gutil = require("gulp-util"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    extend = require("gulp-multi-extend"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    pump = require("pump"),
    eslint = require("gulp-eslint");

gulp.task("browserify", function () {
    "use strict";
    return browserify("./app/filemanager.js")
        .transform({global: true}, require("browserify-css"))
        .bundle()
        .pipe(source("filemanager.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task("uglify", ["browserify"], function (callback) {
    "use strict";
    pump([
        gulp.src("./dist/filemanager.js"),
        uglify(),
        rename({extname: ".min.js"}),
        gulp.dest("./dist")
    ],
    callback);
});

gulp.task("static", function () {
    "use strict";
    return gulp.src([
        "./images/wait30trans.gif",
        "./images/fileicons/**",
        "./index.html",
        "./themes/**",
        "./app/config/filemanager.config.json",
        "./node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2",
        "./node_modules/jquery.fancytree/dist/skin-lion/icons.gif",
        "./node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
        "./node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf"
    ], {base: "./"})
        .pipe(gulp.dest("./dist"));
});

gulp.task("lint", function () {
    "use strict";
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(["app/*.js", "!node_modules/**"])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task("config", function () {
    "use strict";
    return gulp.src(["./app/config/*.json"])
        .pipe(gulp.dest("./dist/config"));
});

gulp.task("language", function () {
    "use strict";
    return gulp.src(["./app/lang/*.json"])
        .pipe(extend("./app/lang/en.json"))
        .pipe(gulp.dest("./dist/lang"));
});

// create a default task and just log a message
gulp.task("default", ["lint", "language", "browserify", "uglify", "static", "config"], function () {
    "use strict";
    return gutil.log("Gulp is running!");
});