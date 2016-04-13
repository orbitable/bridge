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

angular.module('bridge.controllers')
  .controller('bodyController', ['$scope', 'eventPump', 'simulator', function($scope, eventPump, simulator) {
    $scope.selectedBody = {};
    $scope.timestep = 40000;
    $scope.timestepUnits = 'seconds';
    $scope.uDist = 'm';
    $scope.uMass = 'kg';
    $scope.uTime = 's';
    $scope.uLum  = 'L';

    this.updateStep = function() {
      if ($scope.timestepUnits === 'hours') {
        eventPump.timestep = $scope.timestep * 3600;
      } else if ($scope.timestepUnits === 'years') {
        eventPump.timestep = $scope.timestep * 31557600;
      } else {
        eventPump.timestep = $scope.timestep;
      }
    };

    this.remove = function(id) {
      $('#' + id).attr('r', 0);
      simulator.deleteBody(id);
      eventPump.step();
      $('#right-sidebar').hide();
    };

    this.close = function() {
      $('#right-sidebar').hide();
    };

  }
  ]);
