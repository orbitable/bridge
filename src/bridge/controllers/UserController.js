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
  .controller('userController', ['$routeParams', '$scope', 'eventPump', 'Simulation', 'SimulationNote', 'simulator', 'User',  function($routeParams, $scope, eventPump, Simulation, SimulationNote, simulator, User) {
    $scope.isPaused = () => eventPump.paused;
    $scope.User = User;
    
    this.pause = function() {
      eventPump.pause();
    };

    $(function() {
      $('[data-toggle="tooltip"]').tooltip();
    });

    var reset = function(b, n) {
      simulator.reset(b, n);
      eventPump.step(false,true);

      $('#body-sidebar').hide();
      $('#note-sidebar').hide();
      $('#tracker-sidebar').hide();
      $('#add-group').prop( "disabled", false );
      $('#btn_save').prop( "disabled", false );

      lineData = [];
    };

    this.togglePlay = function() {
        if ($scope.isPaused()) {
          eventPump.resume();
          $('#add-group').prop( "disabled", true );
          $('#btn_save').prop( "disabled", true );
        }
        else {
          eventPump.pause();
        }
      };

    this.newSimulation = function() {
      eventPump.pause();
      reset();
    };

    this.paused = function() {
      return eventPump.paused;
    };
    
    this.refreshLocal = function() {
      if ($scope.isPaused()) {
      
        eventPump.pause();
        
        simulator.resetLocal();

        eventPump.step(false,true);
        $('#body-sidebar').hide();
        $('#note-sidebar').hide();
        $('#tracker-sidebar').hide();
        $('#add-group').prop( "disabled", false );
        $('#btn_save').prop( "disabled", false );
        lineData = [];
      }

    };

    this.refresh = function() {
      Simulation.get({
        id: $routeParams.simulationId || 'random'},
          (s) => SimulationNote.query({id: s._id}, (n) => reset(s.bodies, n), () => reset(s)),
          (s)  => console.log('Unable to load simulation'));
    };

    this.ruler = function() {
        var btn = document.getElementById('btn_ruler');
        var index = btn.getAttribute('class').indexOf(' on');
        var ruler = document.getElementById('rulerGroup');
        if (index > -1) {
          btn.setAttribute('class',btn.getAttribute('class').slice(0, index) + ' off');
          ruler.style.visibility = 'hidden';
        } else {
          index = btn.getAttribute('class').indexOf(' off');
          btn.setAttribute('class',btn.getAttribute('class').slice(0, index) + ' on');
          ruler.style.visibility = 'visible';
        }
    };

    this.toggleTrackerPanel = function() {

      if ($scope.trackerPanel.isOpen) {
        $('#tracker-sidebar').hide();
      } else {
        $('#body-sidebar').hide();
        $('#note-sidebar').hide();

        $('#tracker-sidebar').show();
      }

      $scope.trackerPanel.isOpen = !$scope.trackerPanel.isOpen;
    };
    
    this.save = function() {
      if (simulator.isEditable()) {
        eventPump.pause();
        $('#save-sim-modal').modal('show');
      }
    };

  }]);
