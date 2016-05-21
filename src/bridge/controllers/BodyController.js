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
  .controller('bodyController', ['$scope', 'eventPump', 'simulator', 'Units', 'User', 'Scale', function($scope, eventPump, simulator, Units, User, Scale) {
    $scope.trackerPanel = {isOpen: false};

    $scope.timestep = 40000;
    $scope.timestepUnits = 'seconds';
    $scope.simulator = simulator;
    $scope.Units = Units;
    $scope.eventPump = eventPump;
    $scope.User = User;

    this.getRunningState = function() {
      return !eventPump.paused || !simulator.isEditable();
    };

    this.setState = function(state){
        $scope.simulator.orbitTracker.setState(state,$scope.simulator.simulationTime);
    };

    this.getState = function() {
        return $scope.simulator.orbitTracker.running;
    };
    
    this.snapToBody = function(body) {
      // If the given body IS the following body, clear the following body (disable following)
      if ($scope.followingBody === body) {
        $scope.followingBody = null;
      } 
      // Otherwise, set the following body to be the given body and snap the view to it
      else {
        $scope.followingBody = body;
        Scale.snapToBody(body); 
      } 
    };

    this.updateBody = function(body){
      if(User.current && simulator.isEditable()) {
        simulator.updateBody(body.id, body);
        eventPump.step(false, true);
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
      if(User.current && simulator.isEditable()){
        $('#' + id).attr('r', 0);
        simulator.deleteBody(id);
        eventPump.step(false,true);
        $('#body-sidebar').hide();
      }
    };

    this.close = function() {
      $('#body-sidebar').hide();
      $('#note-sidebar').hide();
    };

    this.toggleHabitable = function(b){
      var body = {
        hideHabitable : !b.hideHabitable
      }
      simulator.updateBody(b.id, body);
      eventPump.step(false,true);
    };
  }]);
