var angular = require('angular');
var Simulator = require('engine');

angular.module('bridge.services')
  .factory('simulator', ["eventPump", function(eventPump) {
    var simulator = new Simulator();
    
    // Bind update function to event pump callback
    eventPump.register(function() {
      // TODO: Be able to query eventPump for current FPS to adjust dt 
      // accordingly such that the same amount of dt accumlates per second
      // irregardless of FSP.
      simulator.update(0.015);
    });

    return simulator;
  }]);
