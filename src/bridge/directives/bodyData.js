var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', function(){
    return {
      template: '<div class="panel-heading">Body</div>'+
      '<div class="panel-body"> x, y, mass</div>'
    };
  });
