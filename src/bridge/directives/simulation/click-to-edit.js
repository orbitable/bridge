var angular = require('angular');

angular.module('bridge.directives')
  .directive('clickToEdit', function(){

    return {
      restrict: "A",
      replace: true,
      templateUrl: 'partials/click-to-edit.html',
      scope: {
        value: "=clickToEdit",
      },

      controller: function($scope) {
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
});
