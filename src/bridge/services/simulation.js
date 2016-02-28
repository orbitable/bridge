angular.module('bridge.services')
  .factory('Simulation', ['$resource', function($resource) {
      return $resource('http://mission-control.orbitable.tech/simulations/:id');
  }]);
