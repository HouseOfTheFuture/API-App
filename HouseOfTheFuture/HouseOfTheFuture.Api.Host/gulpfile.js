var gulp = require("gulp"),
merge = require("merge2"),
ts = require("gulp-typescript"),
bower = require("gulp-bower"),
mainBowerFiles = require("gulp-main-bower-files");
clean = require("gulp-clean"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    uglify = require('gulp-uglify'),
    gulpFilter = require('gulp-filter'),
    templateCache = require('gulp-angular-templatecache'),
    minifyHTML = require('gulp-minify-html');

/**
 * Bower
 */
gulp.task("clean-lib", function () {
    return gulp.src(["lib"], { read: false })
      .pipe(clean());
});
gulp.task("bower", function () {
    return bower();
});
gulp.task("lib", ["bower", "clean-lib"], function () {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    var filterCSS = gulpFilter('**/*.css', { restore: true });
    return gulp.src("./bower.json")
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(concat('vendor.css'))
        .pipe(filterCSS.restore)
        .pipe(gulp.dest("./lib/"));
});


/**
 * Typescript
 */
var beTsProject = ts.createProject({
    module: "AMD",
    sortOutput: true
});
gulp.task("typescript", function() {
    var tsResult = gulp.src(["./**/*.ts", "!./node_modules/**", "!./bower_components/**"])
        .pipe(sourcemaps.init())
        .pipe(ts(beTsProject));
    var singleJs = tsResult.js
        .pipe(concat('script.js')) // You can use other plugins that also support gulp-sourcemaps 
        //.pipe(uglify())
        .pipe(sourcemaps.write()); // Now the sourcemaps are added to the .js file ;
    return merge([
        singleJs.pipe(gulp.dest("./"))
    ]);
});
/**
 * Templates
 */
var opts = {
    conditionals: true,
    spare: true
};
gulp.task("templates", function () {
    return gulp.src(["./**/*.html", "!./node_modules/**", "!./index.html"])
        .pipe(minifyHTML(opts))
        .pipe(templateCache("templates.js", { module: "HouseOfTheFuture" }))
        .pipe(gulp.dest("./"));
});

/**
 * Watcher
 */
gulp.task("default", ["lib", "typescript", "templates"], function () {
    gulp.watch(["./**/*.ts", "!./node_modules/"], ["typescript"]);
    gulp.watch(["./**/*.html", "!./node_modules/", "!./index.html"], ["templates"]);
    //gulp.watch(["./bower.json"], ["lib"]);
});
