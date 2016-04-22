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
  .controller('userController', ['$scope', '$routeParams', 'eventPump', 'Simulation', 'simulator', 'User',  function($scope, $routeParams, eventPump, Simulation, simulator, User) {
    $scope.pump = eventPump.paused ? 'play' : 'pause';
    $scope.User = User;

    this.togglePlay = function() {
        if (eventPump.paused) {
          eventPump.resume();
          $scope.pump = 'pause';
        } else {
          eventPump.pause();
          $scope.pump = 'play';
        }
      };

    this.paused = function() {
        return eventPump.paused;
      };

    this.refresh = function() {
        Simulation.get({
          id: $routeParams.simulationId || 'random'},
          function(s) {
            simulator.reset(s.bodies);
            eventPump.step(false,true);
            $('#right-sidebar').hide();
            $('#note-sidebar').hide();

            // TODO: Global state is bad we need to resolve this
            //
            // Created issue [#93](https://github.com/orbitable/bridge/issues/93)
            // to capture adding a composite object to collect rendering objects.
            lineData = [];
          });
      };

    this.ruler = function() {
        var btn = document.getElementById('btn_ruler');
        var index = btn.getAttribute('class').indexOf(' toggleOn');
        var ruler = document.getElementById('rulerGroup');
        if (index > -1) {
          btn.setAttribute('class',btn.getAttribute('class').slice(0, index) + ' toggleOff');
          ruler.style.visibility = 'hidden';
        } else {
          index = btn.getAttribute('class').indexOf(' toggleOff');
          btn.setAttribute('class',btn.getAttribute('class').slice(0, index) + ' toggleOn');
          ruler.style.visibility = 'visible';
        }
      };
      
       this.tracker = function(){
        var btn = document.getElementById("btn_tracker");
        var index = btn.getAttribute("class").indexOf(" toggleOn");
        var tracker = document.getElementById("tracker-sidebar");
        if (index > -1) {
          btn.setAttribute("class",btn.getAttribute("class").slice(0, index) + " toggleOff");
          tracker.style.visibility = "hidden";
        } else {
          index = btn.getAttribute("class").indexOf(" toggleOff");
          btn.setAttribute("class",btn.getAttribute("class").slice(0, index) + " toggleOn");
          tracker.style.visibility = "visible";
        }
      };
      
      

  }]);
