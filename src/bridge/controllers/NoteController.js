angular.module('bridge.controllers')
  .controller('noteController', ['$scope', 'simulator', function($scope, simulator) {

    $scope.showNotes = function() {
      return simulator.notes.filter(function(n) {
        return n.check(simulator.simulationTime);
      });
    };
  
  }])