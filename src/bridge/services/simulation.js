angular.module('bridge.services')
  .factory('Simulation', ['$resource', function($resource) {
      return $resource('http://demo.orbitable.tech/simulations/:id');
  }]);
