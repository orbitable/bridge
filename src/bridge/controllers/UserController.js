angular.module('bridge.controllers')
  .controller('userController', ['$scope', 'eventPump', function($scope, eventPump) {

      // default state is anon. may be a better way to do this
      $scope.user = {"auth": false};

      $scope.register = function(person){
        // TODO: integrate with back end auth service
        $scope.user = angular.copy(person);
        $scope.user.auth = true;
        $('#sign-up').modal('toggle');
      };

      $scope.authorize = function(person){
        // TODO: integrate with back end auth service
        $scope.user = angular.copy(person);
        $scope.user.name = 'user';
        $scope.user.auth = true;
        $('#sign-in').modal('toggle');
      };

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
