define([
    'backbone'
], function(Backbone) {
  "use strict";

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index'
    },

    index: function() {
      console.log('index triggered');
    }
  });

  return Router;
});
