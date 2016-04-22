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
  .controller('simulationListController', ['$scope', '$routeParams','Simulation', 'UserSimulation', function($scope, $routeParams, Simulation, UserSimulation) {
    $scope.message = 'Hold on, we are loading the list simulations';
    $scope.failed = false;

    var updateSimulations = function(s) {
      $scope.message = null;
      $scope.simulations = s;
    };

    var errorHandler = function(err) {
      console.warn(err);
      if (err.status === 404) {
        $scope.message = 'The given username does not exist';
      } else {
        $scope.message = 'Whoa! There was a problem getting the simulations.';
      }
      $scope.failed = true;
    };

    if ($routeParams.userId) {
      UserSimulation.query(
          {id: $routeParams.userId},
          updateSimulations,
          errorHandler
      );
    } else {
      Simulation.query(updateSimulations, errorHandler);
    }
  }]);
