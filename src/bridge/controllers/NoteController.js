angular.module('bridge.controllers')
  .controller('noteController', ['$scope',  'simulator', function($scope,  simulator) {

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
    
    this.removeNote = function(id) {
      $('#' + id).attr('stroke-width', 0);
      simulator.deleteNote(id);
      //eventPump.step(false,true);
      this.closePanel();
    };
    
    this.updateNote = function() {
        var n = $scope.selectedBody;
        simulator.updateNote(n.id, n);
    };

    this.closePanel = function() {
      $('#note-sidebar').hide();
    };
  
  }])
