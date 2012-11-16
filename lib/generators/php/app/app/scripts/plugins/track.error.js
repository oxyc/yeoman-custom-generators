/*globals _gaq:true define:true */

// Track JavaScript errors in Google Analytics

define([], function() {
  return function() {
    var link = function (href) {
      var a = window.document.createElement('a');
      a.href = href;
      return a;
    };
    window.onerror = function (message, file, row) {
      var host = link(file).hostname;
      _gaq.push([
          '_trackEvent'
        , (host === window.location.hostname || host === undefined || host === '' ? '' : 'external ') + 'error'
        , message, file + ' LINE: ' + row, undefined, undefined, true
      ]);
    };
  };
});
