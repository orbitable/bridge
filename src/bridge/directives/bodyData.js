var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', function(){
    $('#right-sidebar').hide();
    return {
      scope: false,
      template: '<div>radius: {{selectedBody.radius | number:1}}<br> mass: {{selectedBody.mass | number:0}}'+
        '<br>x: {{selectedBody.position.x | number:1}}<br>y: {{selectedBody.position.y | number:1}}'+
        '<br>velocity x: {{selectedBody.velocity.x | number:1}}<br>velocity y: {{selectedBody.velocity.y | number:1}}</div>'
    };
  });
