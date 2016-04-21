var angular = require('angular');

angular.module('bridge.directives')
  .directive('noteData', [function(){
    $('#note-sidebar').hide();
    return {
      scope: false,
      templateUrl: 'partials/note-data.html'

    };
  }]);
