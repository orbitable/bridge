
angular.module('bridge.directives')
  .directive('simulation', ['$interval', 'eventPump', function($interval, eventPump) {

    function link(scope, element) {
      var intervalId;

      intervalId = $interval(function() {
        //eventPump.simulator.printState(); //Don't know why this directive isn't getting called
      }, 1000);

      var updateCallback = eventPump.register(function() {
        //eventPump.simulator.update(0.015); //Don't know why this directive isn't getting called
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
