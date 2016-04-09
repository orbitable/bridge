var angular = require('angular');

angular.module('bridge.directives')
  .directive('clickToEdit', function(){
    var editorTemplate = '<span class="click-to-edit">' +
    '<span ng-hide="view.editorEnabled">' +
    '<a ng-click="enableEditor()">{{value}}</a>' +
    '</span>' +
    '<span ng-show="view.editorEnabled">' +
    '<input ng-model="view.editableValue">' +
    '<a href="#" ng-click="save()">save</a>' +
    ' or ' +
    '<a ng-click="disableEditor()">cancel</a>' +
    '</span>' +
    '</span>';

    return {
      restrict: "A",
      replace: true,
      template: editorTemplate,
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
