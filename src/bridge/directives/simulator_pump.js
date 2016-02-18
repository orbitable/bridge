
angular.module('bridge.directives')
  .directive('simulation_pump', ['$interval', 'eventPump', function($interval, eventPump) {

    function link(scope, element) {
      var intervalId;

      intervalId = $interval(function() {
        eventPump.simulator.printState();
      }, 1000);

      var updateCallback = eventPump.register(function() {
        eventPump.simulator.update(0.015);
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
