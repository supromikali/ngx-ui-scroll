// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-spec-reporter'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter')
    ],
    files: [
      { pattern: 'spec.bundle.js', watched: false }
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },

    preprocessors: {
      'spec.bundle.js': ['webpack', 'sourcemap']
    },
    webpack: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts/,
            loaders: ['ts-loader'],
            exclude: /node_modules/
          }
        ],
        exprContextCritical: false
      },
      performance: { hints: false },
      devtool: 'inline-source-map'
    },
    webpackServer: {
      noInfo: true
    },

    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [process.platform === 'linux' ? 'Chromium' : 'Chrome'],
    singleRun: false
  });
};
