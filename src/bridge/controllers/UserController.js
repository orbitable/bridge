angular.module('bridge.controllers')
  .controller('userController', ['$scope', 'eventPump', function($scope, eventPump) {
      $scope.user = true;

      this.play = function() {
        eventPump.resume();
      };

      this.pause = function() {
        eventPump.pause();
      };

      this.paused = function() {
        return eventPump.paused;
      };

      this.refresh = function() {
        console.log("refresh");
      };
  }]);
