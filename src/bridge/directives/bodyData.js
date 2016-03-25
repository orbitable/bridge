var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', function(){
    $('#right-sidebar').hide();
    return {
      scope: false,
      template:
    //   '<div>radius: {{selectedBody.radius | distance:uDist }}'+
      '<div>radius: <span click-to-edit="selectedBody.radius"></span>'+
      '<br> mass: {{selectedBody.mass | mass:uMass}}'+
    //   '<br>mass: <span click-to-edit="selectedBody.mass"></span>'+
      '<span ng-show="selectedBody.luminosity"><br>luminosity: '+
      '{{selectedBody.luminosity | luminosity:uLum}}</span>'+
      '<br>x : {{selectedBody.position.x | number:0}}'+
    //   '<br>x : <span click-to-edit="selectedBody.position.x"></span>'+
      '<br>x<sup>1</sup>: {{selectedBody.velocity.x | velocity:uDist:uTime}}'+
      '<br>y : {{selectedBody.position.y | number:0}}'+
    //   '<br>y : <span click-to-edit="selectedBody.position.y"></span>'+
      '<br>y<sup>1</sup>: {{selectedBody.velocity.y | velocity:uDist:uTime}}</div>'
    };
  });
