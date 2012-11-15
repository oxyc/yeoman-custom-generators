// Set the require.js configuration for your application.
require.config({
    // Initialize the application with the main application
    deps: ['main']

  , paths: {
      // JavaScript folders.
      // eg. require(['jquery', 'canvas', 'routes/sub'],
        libs: '../scripts/libs'
      , plugins: '../scripts/plugins'

      // Libraries.
      , jquery: '../scripts/libs/jquery'
      , lodash: '../scripts/libs/lodash'
      , backbone: '../scripts/libs/backbone'
  }
  , shim: {
    // Backbone library depends on lodash and jQuery.
      backbone: {
        deps: ['lodash', 'jquery']
      , exports: 'Backbone'
    }
  }
});
