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
  .controller('bodyController', ['$scope', 'eventPump', 'Simulation', 'simulator',  function($scope, eventPump, Simulation, simulator) {
    $scope.selectedBody = {};
    $scope.uDist = 'm';
    $scope.uMass = 'kg';
    $scope.uTime = 's';
    $scope.uLum  = 'L';
    $scope.simulator = simulator;
    
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
  }
  ]);
