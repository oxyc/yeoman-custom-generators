require([
    'jquery'
  , 'backbone'
  , 'app'
  , 'views/app-view'
  , 'routes/router'
], function($, Backbone, app, AppView, Router) {
  "use strict";

  console.log('main.js loaded');

  app.router = new Router();
  Backbone.history.start({ pushState: false, root: app.root });
  app.view = new AppView();

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on('click', 'a:not([data-bypass])', function(evt) {
    var href = this.href;

    // If the href exists and is a hash route, run it through Backbone.
    if (href && href.indexOf('#') === 0) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();
      Backbone.history.navigate(href, true);
    }
  });
});
