var angular = require('angular');

angular.module('bridge.directives')
  .directive('noteData', [function(){
    return {
      scope: false,
      templateUrl: 'partials/note-data.html'
    };
  }]);
