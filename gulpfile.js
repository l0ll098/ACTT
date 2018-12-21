const gulp = require("gulp");
const exec = require("gulp-exec");
const del = require("del");


const Tasks = Object.freeze({
    Clean: "Clean",

    BuildClient: "BuildClient"
});

const DIST_FOLDER = "dist/";


gulp.task(Tasks.BuildClient, () => {
    return gulp
        .src(".")
        .pipe(exec("npm run buildProd"));
});

gulp.task(Tasks.Clean, () => {
    return del([
        DIST_FOLDER + "**"
    ]);
});


gulp.task("default", (done) => {
    return gulp.series(
        Tasks.Clean,
        Tasks.BuildClient
    )(done);
});
