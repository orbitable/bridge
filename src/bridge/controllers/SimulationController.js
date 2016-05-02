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
  .controller('simulationController', ['$scope', 'eventPump', '$routeParams', 'simulator', 'Simulation', 'SimulationNote', function($scope, eventPump, $routeParams, simulator, Simulation, SimulationNote) {
    $scope.simulationId = $routeParams.simulationId;

    Simulation.get({id: $scope.simulationId}, function(simulation) {

      // Update the document title with the simulation title
      document.title = 'Oribitable - ' + simulation.title;

      // Update the simulator with the data
      simulator.reset(simulation.bodies);

      SimulationNote.query({id: $scope.simulationId}, function(notes) {
        simulator.reset(simulation.bodies, notes);
        eventPump.step(false,true);
      });

      eventPump.step(false,true);
    });
  }]);
