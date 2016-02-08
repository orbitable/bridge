// wrap entire app in an enclosure
(function(){

  // define module
  var app = angular.module('orbitable', []);

  // test directive, draw circles
  app.controller('TestController', function(){
    var c = document.getElementById("main-canvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(800,600,40,0,2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1,80,40,0,2*Math.PI);
    ctx.stroke();
  });

  //
  app.controller('BodyController', function(){
  });


  // admin panel
  app.controller('AdminController', function($scope){
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
  });

  // user functions
  app.controller('UserController', function($scope){
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
  // user prototype functions

  // determine size of client window and initalize canvas

  var body = {
    x: 10,
    y: 15,
    x1: 5,
    y1: 0,
    mass: 100
  }
  test = function(){
    return true;
  }
})();
