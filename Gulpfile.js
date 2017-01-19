const gulp = require('gulp');
const babel = require('gulp-babel');
const rimraf = require('gulp-rimraf');
const spawn = require('child_process').spawn;
const path = require('path');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

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
    .on('error', handleError)
);

gulp.task('clean', () =>
  gulp.src('dist')
    .pipe(rimraf())
);

const electronPath = path.join(__dirname, '/node_modules/.bin/electron');

gulp.task('run:electron', (cb) => {
  const proc = spawn(electronPath, [__dirname]);
  proc.stdout.on('data', (data) => process.stdout.write(data));
  proc.stderr.on('data', (data) => process.stderr.write(data));
  proc.on('close', () => cb());
});

gulp.task('dev', ['default'], () => {
  setTimeout(() => gulp.start('run:electron'), 500);
  gulp.start('watch');
});

gulp.task('default', ['clean'], () =>
  gulp.start('build')
);
