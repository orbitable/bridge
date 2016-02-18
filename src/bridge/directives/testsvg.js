angular.module('bridge.directives')
  .directive('testsvg', ['$interval', 'eventPump', function($interval, eventPump) {

    function link(scope, element) {
      var intervalId;
      var count = 0;

      intervalId = $interval(function() {
        var state = eventPump.paused ? 'Paused' : 'Running';
        element.text('State: ' + state + ' FPS: ' + count);

        count = 0;
      }, 1000);

      var updateCallback = eventPump.register(function() {
        count++;
      });

      eventPump.resume();

      element.on('destroy', function() {
        eventPump.unregister(updateCallback);
        $interval.cancel(intervalId);
      });
    }

    return {
      link: link
    };
  }]);
