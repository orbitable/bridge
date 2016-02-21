var angular = require('angular');

angular.module('bridge.controllers')
  .controller('adminController', function($scope) {
    $scope.admin = true;
    this.add = function() {
      console.log("add function()");
    };
    this.remove = function() {
      console.log("remove function()");
    };
    this.save = function() {
      console.log("save function()");
    };
    this.tip = function() {
      console.log("tip function()");
    };
    this.record = function() {
      console.log("record function()");
    };
  });
