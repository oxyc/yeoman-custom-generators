/*global describe:true, before:true, after:true, it:true, beforeEach:true, afterEach:true */
/*jshint es5:true */
var app = require('../')
  , config = require('../config')
  , assert = require('should');

describe('Application', function() {
  it('should listen on correct port', function() {
    var port = app.address().port;
    port.should.equal(config.port);
  });
});
