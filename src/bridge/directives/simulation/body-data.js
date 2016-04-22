var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodyData', function(){
    $('#right-sidebar').hide();

    return {
      scope: false,
      templateUrl: 'partials/body-data.html'
    };
  });
