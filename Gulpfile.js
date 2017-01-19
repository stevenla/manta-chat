const gulp = require('gulp');
const babel = require('gulp-babel');
const rimraf = require('gulp-rimraf');
const spawn = require('child_process').spawn;
const path = require('path');

function doSpawn(script, args, cb) {
  const proc = spawn(script, args);
  proc.stdout.on('data', (data) => process.stdout.write(data));
  proc.stderr.on('data', (data) => process.stderr.write(data));
  proc.on('close', () => cb());
  return proc;
}

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


gulp.task('electron:run', (cb) => {
  doSpawn(
    path.join(__dirname, '/node_modules/.bin/electron'),
    [__dirname],
    cb
  );
});

gulp.task('electron:pkg', ['default'], (cb) => {
  doSpawn(
    path.join(__dirname, '/node_modules/.bin/electron-packager'),
    [
      __dirname,
      'Manta',
      '--platform=darwin',
      '--arch=all',
      '--icon=manta.icns',
      '--ignore=src',
      '--prune',
      '--overwrite',
    ],
    cb
  );
});

gulp.task('dev', ['default'], () => {
  setTimeout(() => gulp.start('electron:run'), 500);
  gulp.start('watch');
});

gulp.task('default', ['clean'], () =>
  gulp.start('build')
);
