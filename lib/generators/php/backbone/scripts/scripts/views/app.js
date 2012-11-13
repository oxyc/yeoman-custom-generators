define([
  'app'
], function(app) {
  var AppView = Backbone.View.extend({
      el : '#main'
    , initialize: function() {
      console.log('AppView initialized');
    }
  });

  return AppView;
});
