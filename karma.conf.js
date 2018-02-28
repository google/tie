// Karma configuration for TIE.
// Generated (and revised) on Mon Feb 13 2017 17:54:48 GMT-0800 (PST).

module.exports = function(config) {
  // NOTE TO DEVELOPERS: to enable coverage reports, call `karma start` with
  // the added arg `--enable-coverage`. We disable it by default because it
  // interferes with the debugger during regular development.
  var preprocessorOptions = config.enableCoverage ? ['coverage'] : [];

  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: '',
    frameworks: ['jasmine', 'es6-shim'],
    // List of files / patterns to load in the browser.
    files: [
      'third_party/angular-1.6.1/angular.min.js',
      'third_party/angular-1.6.1/angular-aria.min.js',
      'third_party/angular-1.6.1/angular-mocks.js',
      'third_party/angular-cookies-1.6.1/angular-cookies.min.js',
      'third_party/codemirror-5.19.0/lib/codemirror.js',
      'third_party/codemirror-5.19.0/mode/python/python.js',
      'third_party/skulpt-12272b/skulpt.min.js',
      'third_party/skulpt-12272b/skulpt-stdlib.js',
      'third_party/ui-codemirror-0.3.0/ui-codemirror.min.js',
      // Need to explicitly specify question.js first due to the files being
      // loaded in descending order.
      'client/question/question.js',
      'client/data/data.js',
      'client/menu/menu.js',
      'client/**/*.js',
      'assets/**/*.js'
    ],
    '6to5Preprocessor': {
      options: {
        sourceMap: 'inline'
      }
    },
    // List of files to exclude.
    exclude: [],
    // Pre-process matching files before serving them to the browser.
    preprocessors: {
      'client/**/*.js': preprocessorOptions,
      'assets/**/*.js': preprocessorOptions
    },
    // Test results reporter to use. Possible values: 'dots', 'progress'.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter.
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [{
        type: 'html'
      }, {
        type: 'json'
      }],
      subdir: '.',
      dir: './karma_coverage_reports'
    },
    // Custom launcher (to test without browser access)
    customLaunchers: {
      'phantomjs': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          },
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },
    // Phantomjs properties
    phantomjsLauncher: {
      exitOnResourceError: true
    },
    // Web server port.
    port: 9876,
    // Enable / disable colors in the output (reporters and logs).
    colors: true,
    // Level of logging.
    logLevel: config.LOG_INFO,
    // Enable / disable watching file and executing tests whenever any file changes.
    autoWatch: true,
    // Start these browsers.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
    // Continuous Integration mode.
    // If true, Karma captures browsers, runs the tests and exits.
    singleRun: true,
    // Concurrency level (how many browsers should be started simultaneously).
    concurrency: Infinity
  })
}
