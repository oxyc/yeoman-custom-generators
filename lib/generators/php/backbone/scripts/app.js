define([
    'lodash'
  , 'backbone'
  , 'plugins/console'
  // , 'plugins/backbone.analytics'
], function(_, Backbone, createConsole) {
  "use strict";

  createConsole();
  console.log('main app.js loaded');

  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application.
    root: '/'
  };

  // If you have a function used across the app you should attach it to the app
  // object here.

  // Mix Backbone.Event and the global app settings into the app object.
  return _.extend(app, window.app, Backbone.Events);
});
