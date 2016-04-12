/* Copyright 2016 Orbitable Team Members
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

angular.module('bridge.controllers.auth')
  .controller('registerModalController', ['$scope', 'User', function($scope, User) {
    // A simple state machine that follows submitting a user registration
    reset();

    $scope.submit = function() {

      // TODO: Do some form validation

      $scope.isRegistering = true;
      $scope.didFail = false;

      User.register($scope.user)
        .then(onSuccess, onFailure);
    };

    function onSuccess(createdUser) {
      $scope.message = 'User successfully created';
      User.login($scope.user.username, $scope.user.password)
        .then(reset, onFailure);
    };

    function onFailure(err) {
      $scope.didFail = true;
      $scope.isRegistering = false;

      $scope.message = 'Failed to create user:' + err.statusText;
    };

    function reset() {
      $scope.user = {};
      $scope.isRegistering = false;
      $scope.didFail = false;
      $scope.message = null;
      $('#sign-up-modal').modal('hide');
    };
  }]);
