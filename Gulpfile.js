const gulp = require('gulp');
const babel = require('gulp-babel');
const prettier = require('gulp-prettier');
const rimraf = require('gulp-rimraf');
const spawn = require('child_process').spawn;
const path = require('path');
const sequence = require('run-sequence');


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
    .pipe(babel().on('error', handleError))
    .pipe(gulp.dest('dist'))
);

gulp.task('build:prettier', () =>
  gulp.src('src/**/*.js')
    .pipe(prettier({
      singleQuote: true,
      trailingComma: 'all',
    }).on('error', handleError))
    .pipe(gulp.dest(file => file.base))
);

gulp.task('build:copy', () =>
  gulp.src(['src/**/!(*.js)', 'src/**/*.json'])
    .pipe(gulp.dest('dist'))
);

gulp.task('build', ['build:prettier', 'build:babel', 'build:copy']);

gulp.task('watch', ['build'], () =>
  gulp.watch('src/**/*', ['build'])
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
      '--ignore=' + path.resolve(__dirname, 'src'),
      '--prune',
      '--overwrite',
    ],
    cb
  );
});

gulp.task('dev', ['default'], () => {
  gulp.start('electron:run');
  gulp.start('watch');
});

gulp.task('default', ['clean'], (done) =>
  sequence('build', done)
);
