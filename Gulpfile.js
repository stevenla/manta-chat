const gulp = require('gulp');
const babel = require('gulp-babel');
const rimraf = require('gulp-rimraf');

gulp.task('build:babel', () =>
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
);

gulp.task('build:copy', () =>
  gulp.src(['src/**/!(*.js)', 'src/**/*.json'])
    .pipe(gulp.dest('dist'))
);

gulp.task('build', ['build:babel', 'build:copy']);

gulp.task('watch', ['build'], () =>
  gulp.watch('src/**/*', ['build'])
);

gulp.task('clean', () =>
  gulp.src('dist')
    .pipe(rimraf())
);

gulp.task('default', ['clean'], () =>
  gulp.start('build')
);
