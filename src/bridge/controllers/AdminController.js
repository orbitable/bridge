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

var angular = require('angular');

angular.module('bridge.controllers')
  .controller('adminController', ['$scope', 'User', '$log', function($scope, User, $log) {
    $scope.user = User;

    this.add = function() {
      $log.debug('add function()');
    };
    this.remove = function() {
      $log.debug('remove function()');
    };
    this.save = function() {
      $log.debug('save function()');
    };
    this.tip = function() {
      $log.debug('tip function()');
    };
    this.record = function() {
      $log.debug('record function()');
    };
  }]);
