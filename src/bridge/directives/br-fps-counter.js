
angular.module('bridge.directives')
  .directive('counter', ['$interval', 'eventPump', function($interval, eventPump) {

    function link(scope, element) {
      var intervalId;
      var count = 0;

      intervalId = $interval(function() {
        var state = eventPump.paused ? 'Paused' : 'Running';
        element.text('State: ' + state + ' FPS: ' + count);
        eventPump.simulator.printState(); // I want to move this to simulator_pump.js
        count = 0;
      }, 1000);

      var updateCallback = eventPump.register(function() {
        eventPump.simulator.update(0.015); // I want to move this to simulator_pump.js
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
