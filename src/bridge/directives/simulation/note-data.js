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
      '<div class="input-group">' +
        '<span class="input-group-addon" id="title-input">Title:</span>' +
        '<input type="text" class="form-control" placeholder="{{selectedBody.title}}" aria-describedby="title-input">' +
      '</div><br>' +
      '<div class="input-group">' +
        '<span class="input-group-addon" id="text-input">Text:</span>' +
        '<textarea type="text" rows = "3" class="form-control" placeholder="{{selectedBody.text}}" aria-describedby="text-input"></textarea>' +
      '</div><br>' +
      '<div class="input-group">' +
        '<span class="input-group-addon" id="startTime-input">Start Time:</span>' +
        '<input type="text" class="form-control" placeholder="{{selectedBody.startTime}}" aria-describedby="startTime-input">' +
      '</div><br>' +
      '<div class="input-group">' +
        '<span class="input-group-addon" id="duration-input">Duration:</span>' +
        '<input type="text" class="form-control" placeholder="{{selectedBody.duration}}" aria-describedby="duration-input">' +
      '</div><br>' +
      
      '<div class="input-group">' +
        '<span class="input-group-addon" id="positionX-input">Position X:</span>' +
        '<input type="text" class="form-control" placeholder="{{selectedBody.position.x}}" aria-describedby="positionX-input">' +
      '</div>' +
      '<div class="input-group">' +
        '<span class="input-group-addon" id="positionY-input">Position Y:</span>' +
        '<input type="text" class="form-control" placeholder="{{selectedBody.position.y}}" aria-describedby="positionY-input">' +
      '</div><br>' +
      '<div class="text-center"><button type="button" class="btn btn-default btn" ng-click="b.removeNote(selectedBody.id)">' +
      '<span class="glyphicon glyphicon-trash"></span> </button> </div>'+
      '</div>'
    };
  }]);
