angular.module('bridge.controllers')
  .controller('noteController', ['$scope', 'simulator', function($scope, simulator) {

 
    $scope.showNotes = simulator.notes;
  
  }])