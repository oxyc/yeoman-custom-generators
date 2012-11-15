define([
    'backbone'
  , 'routes/router'
], function(Backbone, Router) {
  "use strict";

  var router = new Router();
  describe('Router', function() {
    it('should be a real router', function() {
      expect(router).to.be.an.instanceof(Backbone.Router);
    });
    it('should have an index route', function() {
      expect(router.index).to.be.a('function');
    });
  });
  return {};
});
