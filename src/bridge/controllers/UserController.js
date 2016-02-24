angular.module('bridge.controllers')
  .controller('userController', ['$scope', 'eventPump', function($scope, eventPump) {

      /* DEMO */
      $scope.user = true;
      $scope.name = "Donald Knuth";

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

      this.logout = function(){
        $scope.user = false;
      };
  }]);
