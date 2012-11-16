/*globals _gaq:true define:true */

// Log all jQuery AJAX requests to Google Analytics
// See: http://www.alfajango.com/blog/track-jquery-ajax-requests-in-google-analytics/

define([
    'jquery'
], function($) {
  return function() {
    $(document).ajaxSend(function(event, xhr, settings) {
      _gaq.push(['_trackPageview', settings.url]);
    });
  };
});
