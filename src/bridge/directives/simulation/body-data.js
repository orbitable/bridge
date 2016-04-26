var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', function(){
    return {
      scope: false,
      templateUrl: 'partials/body-data.html'
    };
  });
