angular.module('bridge.controllers')
  .controller('bodyController', ['$scope', 'eventPump', function($scope, eventPump) {
    var count = 0;
    $scope.radius = 100;

    eventPump.register(function() {
      $scope.radius = count++ % 100;
    });
  }]);
