var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', [function(){
    $('#right-sidebar').hide();
    return {
      scope: false,
      template:
      '<div class="panel-heading text-center">'+
      '<button type="button" class="close" aria-label="Close" ng-click="b.close()")"><span>&times;</span></button>'+
      '{{selectedBody.name}}</div>'+
      ' <div class="panel-body">'+
      'radius: {{selectedBody.radius | distance:uDist }}'+
      '<br> mass: {{selectedBody.mass | mass:uMass}}'+
      '<span ng-show="selectedBody.luminosity"><br>luminosity: '+
      '{{selectedBody.luminosity | luminosity:uLum}}</span>'+
      '<br>x : {{selectedBody.position.x | number:0}}'+
      '<br>x<sup>1</sup>: {{selectedBody.velocity.x | velocity:uDist:uTime}}'+
      '<br>y : {{selectedBody.position.y | number:0}}'+
      '<br>y<sup>1</sup>: {{selectedBody.velocity.y | velocity:uDist:uTime}}' +
      '<div class="text-center"><button type="button" class="btn btn-default btn" ng-click="b.remove(selectedBody.id)">' +
      '<span class="glyphicon glyphicon-trash"></span> </button> </div>'+
      '</div>'
    };
  }]);
