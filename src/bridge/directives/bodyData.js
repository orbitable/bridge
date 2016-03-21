var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', [function(){
    $('#right-sidebar').hide();
    return {
      scope: false,
      template:
      '<div>radius: {{selectedBody.radius | distance:uDist }}'+
      '<br> mass: {{selectedBody.mass | mass:uMass}}'+
      '<span ng-show="selectedBody.luminosity"><br>luminosity: '+
      '{{selectedBody.luminosity | luminosity:uLum}}</span>'+
      '<br>x: {{selectedBody.position.x | number}}'+
      '<br>y: {{selectedBody.position.y | number}}'+
      '<br>velocity x: {{selectedBody.velocity.x | velocity:uDist:uTime}}'+
      '<br>velocity y: {{selectedBody.velocity.y | velocity:uDist:uTime}}</div>'
    };
  }]);
