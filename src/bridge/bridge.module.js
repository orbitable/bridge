var angular = require('angular');

angular.module('bridge.controllers', []);
angular.module('bridge.services', []);
angular.module('bridge.directives', []);

angular.module('bridge', [
    'bridge.services',
    'bridge.controllers',
    'bridge.directives'
  ])
  .run(function($interval, simulator) {
     $interval(function() {
       simulator.printState();
     }, 1000);
  });
