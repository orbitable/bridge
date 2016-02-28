var angular = require('angular');

angular.module('bridge.controllers', []);
angular.module('bridge.services', [require('angular-resource')]);
angular.module('bridge.directives', []);

angular.module('bridge', [
    'bridge.services',
    'bridge.controllers',
    'bridge.directives'
  ])
  .run(function($interval, Simulation, simulator) {
    // On application load reset the simulation with the latest simulation state
    Simulation.get({id: 'random'}, function(simulation) {
      simulator.reset(simulation.bodies);
    });
  });
