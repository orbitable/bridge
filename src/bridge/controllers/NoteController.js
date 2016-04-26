angular.module('bridge.controllers')
  .controller('noteController', ['$scope', 'eventPump',  'simulator', function($scope, eventPump, simulator) {

    $scope.notePause = false;
    $scope.notes = [];

    eventPump.register(function() {
      $scope.notePause = simulator.notes.filter((n) => n.pauseSim).length > 0;
      var newNotes = simulator.notes.filter(function(n) {
        return n.check(simulator.simulationTime);
      });

      if ($scope.notes.length !== 0 && newNotes.length === 0) {
        $scope.notes = [];
        $scope.$apply();
      }

      newNotes.map((n) => n.id).forEach(function(n) {
        if ($scope.notes.indexOf(n) === -1) {
          $scope.notes = newNotes;
          $scope.$apply();
        }
      });
    });

    this.removeNote = function(id) {
      $('#' + id).attr('stroke-width', 0);
      simulator.deleteNote(id);
      eventPump.step(false,true);
      this.closePanel();
    };

    this.updateNote = function() {
      var n = $scope.selectedNote;
      simulator.updateNote(n.id, n);
    };

    this.closePanel = function() {
      $('#note-sidebar').hide();
    };

  }]);
