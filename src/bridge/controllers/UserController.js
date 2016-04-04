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
  .controller('userController', ['$scope', 'eventPump', 'Simulation', 'simulator', 'User',  function($scope, eventPump, Simulation, simulator, User) {
      var ctrl = this;
      $scope.l = {};
      $scope.user = null;

      // TODO: Use modal controller instead of passing functions through scope.
      $scope.register = function(usr){
        ctrl.register(usr);
        $('#sign-up').modal('toggle');
      };

      $scope.login = function(cred){
        ctrl.login(cred.username, cred.password);
        $('#sign-in').modal('toggle');
      };

      this.register = function(user) {
        User.register(user).then(function(createdUser) {
          console.log(user);
          User.login(user.username, user.password).then(function(authUser) {
            $scope.user = authUser;
          }); 
        }, console.warn);
      };

      this.login = function(username, password) {
        User.login(username, password).then(function(authUser) {
          $scope.user = authUser;
        }, console.warn);
      };

      this.logout = function(){
        User.logout().then(function() {
          $scope.user = null; 
        });
      };

      // TODO: Move these control functions into a seperate controller
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
        Simulation.get({id: 'random'}, function(s) { 
          simulator.reset(s.bodies);
          eventPump.step();
          
          // TODO: Global state is bad we need to resolve this
          //
          // Created issue [#93](https://github.com/orbitable/bridge/issues/93)
          // to capture adding a composite object to collect rendering objects.
          lineData = [];
          pathIndex = [];

        });
      };

      this.ruler = function(){
        var btn = document.getElementById("btn_ruler");
        var index = btn.getAttribute("class").indexOf(" toggleOn");
        var ruler = document.getElementById("rulerGroup");
        if (index > -1) {
          btn.setAttribute("class",btn.getAttribute("class").slice(0, index) + " toggleOff");
          ruler.style.visibility = "hidden";
        } else {
          index = btn.getAttribute("class").indexOf(" toggleOff");
          btn.setAttribute("class",btn.getAttribute("class").slice(0, index) + " toggleOn");
          ruler.style.visibility = "visible";
        }
      };
      
      

  }]);
