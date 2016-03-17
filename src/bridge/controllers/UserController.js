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
  .controller('userController', ['$scope', 'eventPump', 'Simulation', 'simulator',  function($scope, eventPump, Simulation, simulator) {

      // default state is anon. may be a better way to do this
      $scope.user = {"auth": false};

      $scope.register = function(person){
        // TODO: integrate with back end auth service
        $scope.user = angular.copy(person);
        $scope.user.auth = true;
        $('#sign-up').modal('toggle');
      };

      $scope.authorize = function(person){
        // TODO: integrate with back end auth service
        $scope.user = angular.copy(person);
        $scope.user.name = 'user';
        $scope.user.auth = true;
        $('#sign-in').modal('toggle');
      };

      this.play = function() {
        eventPump.resume();
      };

      this.pause = function() {
        eventPump.pause();
      };

      this.paused = function() {
        return eventPump.paused;
      };

      this.refresh = function() {
        Simulation.get({id: 'random'}, (s) => simulator.reset(s.bodies));
      };

      this.logout = function(){
        $scope.user = false;
      };
     this.ruler = function(){
       
       if(document.getElementById("btn_ruler").style.backgroundColor=="white")
       { 
          document.getElementById("btn_ruler").style.backgroundColor="";
       }
       else
       {
        document.getElementById("btn_ruler").style.backgroundColor="white";
       }
      }

  }]);
