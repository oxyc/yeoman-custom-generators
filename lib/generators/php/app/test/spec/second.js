define([
    'backbone'
  , 'app'
  , 'views/app-view'
  , 'main' // Trigger the application setup
], function(Backbone, app, AppView) {
  "use strict";

  describe('Application namespace', function() {
    it('should have root', function() {
      expect(app.root).to.be.a('string');
    });
    it('should have a router', function() {
      expect(app.router).to.be.an.instanceof(Backbone.Router);
    });
    it('should have an appview', function() {
      expect(app.view).to.be.an.instanceof(AppView);
    });
  });
  return {};
});
