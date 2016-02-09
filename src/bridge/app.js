// wrap entire app in an enclosure
(function(angular){

  // define module
  angular.module('orbitable', [])

  .controller('BodyController', function() {})


  // admin panel
  .controller('AdminController', function($scope) {
    $scope.admin = true;
    this.add = function() {
      console.log("add function()");
    }
    this.remove = function() {
      console.log("remove function()");
    }
    this.save = function() {
      console.log("save function()");
    }
    this.tip = function() {
      console.log("tip function()");
    }
    this.record = function() {
      console.log("record function()");
    }
  })

  // user functions
  .controller('UserController', function($scope) {
    $scope.user = true;

    this.play = function() {
      console.log("play function()");
    }
    this.pause = function() {
      console.log("pause function()");
    }
    this.refresh = function() {
      console.log("refresh function()");
    }
  });

})(angular);
