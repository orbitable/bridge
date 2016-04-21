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
      console.log("removeNote: " + id);
      $('#' + id).attr('stroke-width', 0);
      simulator.deleteNote(id);
      //eventPump.step(false,true);
      $('#note-sidebar').hide();
    };
    
    this.updateNote = function() {
      if(User.current){
        var n = $scope.selectedBody;
        simulator.updateNote(n.id, n);
      }
    };
  
  }])