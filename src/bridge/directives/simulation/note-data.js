var angular = require('angular');

angular.module('bridge.directives')
  .directive('noteData', [function(){
    $('#right-sidebar').hide();
    return {
      scope: false,
      template:
      '<div class="panel-heading text-center">'+
      '<button type="button" class="close" aria-label="Close" ng-click="b.close()")"><span>&times;</span></button>'+
      'Note</div>'+
      ' <div class="panel-body">'+
      'title: {{selectedBody.title}}'+
      '<br> start time: {{selectedBody.startTime}}'+
      '<br> duration: {{selectedBody.duration}}'+
      '<br>x : {{selectedBody.position.x | number:0}}'+
      '<br>y : {{selectedBody.position.y | number:0}}'+
      '<div class="text-center"><button type="button" class="btn btn-default btn" ng-click="b.remove(selectedBody.id)">' +
      '<span class="glyphicon glyphicon-trash"></span> </button> </div>'+
      '</div>'
    };
  }]);
