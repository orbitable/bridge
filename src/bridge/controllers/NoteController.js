angular.module('bridge.controllers')
  .controller('noteController', ['$scope', 'eventPump',  'simulator', 'Units', 'User', function($scope, eventPump, simulator, Units, User) {

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
      if (User.current && simulator.isEditable()) {
        $('#' + id).attr('stroke-width', 0);
        simulator.deleteNote(id);
        eventPump.step(false,true);
        this.closePanel();
      }
    };

    this.updateNote = function(note) {
      if (User.current && simulator.isEditable()) {
        simulator.updateNote(note.id, note);
        eventPump.step(false, true);
      }
    };

    this.closePanel = function() {
      $('#note-sidebar').hide();
    };

  }]);
