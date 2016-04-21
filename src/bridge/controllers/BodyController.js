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
  .controller('bodyController', ['$scope', 'eventPump', 'simulator', 'User', function($scope, eventPump, simulator, User) {
    $scope.selectedBody = {};
    $scope.timestep = 40000;
    $scope.timestepUnits = 'seconds';
    $scope.uDist = 'm';
    $scope.uMass = 'kg';
    $scope.uTime = 's';
    $scope.uLum  = 'L';
    $scope.simulator = simulator;

// ORBIT TRACKER FUNCTIONS
    this.selectCenterBody = function(){
        $scope.simulator.orbitTracker.setCenterBody(
            $scope.selectedBody,
            $scope.simulator.simulationTime
        );
    };

    this.selectTargetBody = function(){
        $scope.simulator.orbitTracker.setTargetBody(
            $scope.selectedBody,
            $scope.simulator.simulationTime
        );
    };

    this.setState = function(state){
        $scope.simulator.orbitTracker.setState(state,$scope.simulator.simulationTime);
    };

    this.getState = function() {
        return $scope.simulator.orbitTracker.running;
    };
//

    this.updateBody = function(){
      if(User.current){
        var b = $scope.selectedBody;
        simulator.updateBody(b.id, b);
      }
    };

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
      if(User.current){
        $('#' + id).attr('r', 0);
        simulator.deleteBody(id);
        eventPump.step(false,true);
        $('#right-sidebar').hide();
      }
    };

    this.close = function() {
      $('#right-sidebar').hide();
      $('#note-sidebar').hide();
    };

  }
  ]);
