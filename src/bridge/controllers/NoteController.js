angular.module('bridge.controllers')
  .controller('noteController', ['$scope', 'simulator', function($scope, simulator) {

    $scope.notePause = false;
    
    $scope.showNotes = function() {
      $scope.notePause = false;
      return simulator.notes.filter(function(n) {
        if (n.pauseSim) {
          $scope.notePause = true;
        }
        return n.check(simulator.simulationTime);
      });
    };
  
  }])