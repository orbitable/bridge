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

  // render a body
  app.controller('BodyController', function(){
    this.body = body;
  });


  // admin panel
  app.controller('AdminController', function($scope){
    $scope.admin = true;
  });

  // user functions
  app.controller('UserController', function($scope){
    $scope.user = true;
  });
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
