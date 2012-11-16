/*globals _gaq:true define:true */

// Track pagescroll in Google Analytics

define([
    'jquery'
], function($) {
  return function() {
    $(function(){
      var isDuplicateScrollEvent
        , scrollTimeStart = new Date()
        , $window = $(window)
        , $document = $(document)
        , scrollPercent;

      $window.scroll(function() {
        scrollPercent = Math.round(100 * ($window.height() + $window.scrollTop())/$document.height());
        if (scrollPercent > 90 && !isDuplicateScrollEvent) { //page scrolled to 90%
          isDuplicateScrollEvent = 1;
          _gaq.push(['_trackEvent', 'scroll',
            'Window: ' + $window.height() + 'px; Document: ' + $document.height() + 'px; Time: ' + Math.round((new Date() - scrollTimeStart )/1000,1) + 's',
            undefined, undefined, true
          ]);
        }
      });
    });
  };
});
