var gulp = require('gulp');
var merge = require('merge');
var ts = require('gulp-typescript');

var beTsProject = ts.createProject({
    module: 'commonjs',
    out: 'script.js'
});
gulp.task('typescript', function () {
    var tsResult = gulp.src(["./**/*.ts", "!**/node_modules/**"])
                    .pipe(ts(beTsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.js.pipe(gulp.dest('./'))
    ]);
})
gulp.task('default', ['typescript'], function () {
    gulp.watch(["./**/*.ts", "!**/node_modules/"], ['typescript']);
});
