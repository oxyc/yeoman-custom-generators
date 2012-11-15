define([
    'backbone'
], function(Backbone) {
  "use strict";

  var AppView = Backbone.View.extend({
      el : '#main'
    , initialize: function() {
      this.$el.append('<div>View</div>');
    }
  });

  return AppView;
});
