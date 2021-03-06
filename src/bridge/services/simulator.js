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
var Simulator = require('engine');

angular.module('bridge.services')
  .factory('simulator', ['eventPump', 'Paths', function(eventPump, Paths) {
    var simulator = new Simulator();
    eventPump.simulator = simulator;
    eventPump.timestep = 40000;

    // Bind update function to event pump callback
    eventPump.register(function() {
      // TODO: Be able to query eventPump for current FPS to adjust dt
      // accordingly such that the same amount of dt accumlates per second
      // irregardless of FSP.
      simulator.update(eventPump.timestep);
    });

    var pathResetIntercept = function(fn) {
      return function() {
        Paths.data = [];
        return fn.apply(this, arguments);
      };
    };

    // Intercept calls to reset and remove path data
    simulator.reset = pathResetIntercept(simulator.reset);
    simulator.resetLocal = pathResetIntercept(simulator.resetLocal);

    return simulator;
  }]);
