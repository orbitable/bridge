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

angular.module('bridge.directives')
  .directive('counter', ['$interval', 'eventPump', function($interval, eventPump) {

    function link(scope, element) {
      var intervalId;
      var count = 0;

      intervalId = $interval(function() {
        var state = eventPump.paused ? 'Paused' : 'Running';
        count = 0;
      }, 1000);

      var updateCallback = eventPump.register(function() {
        count++;
        element.text(Math.round(eventPump.simulator.simulationTime) + " seconds");
      });

      element.on('destroy', function() {
        eventPump.unregister(updateCallback);
        $interval.cancel(intervalId);
      });
    }

    return {
      link: link
    };
  }]);
