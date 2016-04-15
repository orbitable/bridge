var angular = require('angular');

angular.module('bridge.directives')
  .directive('clickToEdit', ['velocityFilter', function(velocityFilter){

    return {
      restrict: "A",
      replace: true,
      templateUrl: 'partials/click-to-edit.html',
      scope: {
        value: "=clickToEdit",
        unit: '=unit'
      },

      controller: function($scope) {

        $scope.value = velocityFilter($scope.value, $scope.unit);
        console.log($scope);

        $scope.$watch('unit', function(s){
          console.log("changed", s);
          $scope.value = velocityFilter($scope.value, $scope.unit);
        });
        $scope.view = {
          editableValue: $scope.value,
          editorEnabled: false
        };

        $scope.enableEditor = function() {
          $scope.view.editorEnabled = true;
          $scope.view.editableValue = $scope.value;
        };

        $scope.disableEditor = function() {
          $scope.view.editorEnabled = false;
        };

        $scope.save = function() {
          $scope.value = $scope.view.editableValue;
          $scope.disableEditor();
        };
      }
    };
}]);
