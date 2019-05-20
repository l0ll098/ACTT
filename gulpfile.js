const gulp = require("gulp");
const exec = require("gulp-exec");
const del = require("del");


const Tasks = Object.freeze({
    Clean: "Clean",

    BuildClient: "BuildClient",
    BuildFunctions: "BuildFunctions",
    BuildServer: "BuildServer"
});

const DIST_FOLDER = "dist";
const FUNCTIONS_FOLDER = "functions";


gulp.task(Tasks.BuildClient, () => {
    return gulp
        .src(".")
        .pipe(exec("npm run build:prod"));
});

/**
 * Compiles Server and client by executing the build:prod command specified in the package.json file
 */
gulp.task(Tasks.BuildServer, () => {
    return gulp
        .src(".")
        .pipe(exec("npm run build:ssr:prod"));
});

gulp.task(Tasks.BuildFunctions, () => {
    return gulp
        .src(FUNCTIONS_FOLDER)
        .pipe(exec("npm run build", {
            cwd: `${FUNCTIONS_FOLDER}/`
        }));
});

gulp.task(Tasks.Clean, () => {
    return del([
        `${DIST_FOLDER}/**`,
        `${FUNCTIONS_FOLDER}/lib/**`
    ]);
});


gulp.task("default", (done) => {
    return gulp.series(
        Tasks.Clean,
        gulp.parallel([
            Tasks.BuildServer,
            Tasks.BuildFunctions
        ])
    )(done);
});
