angular.module('bridge.controllers')
  .controller('bodyController', ['$scope', 'eventPump', function($scope, eventPump) {
    $scope.selectedBody = {};
  }
  ]);
