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

angular.module('bridge.controllers.auth')
  .controller('saveSimulationModalController', ['$location', '$q', '$scope', 'Simulation', 'simulator', 'User', 'Note', function($location, $q, $scope, Simulation, simulator, User, Note) {
    // A simple state machine that follows submitting a user registration
    reset();

    $scope.submit = function() {

      $scope.isSaving = true;
      $scope.didFail = false;

      Simulation.save({
            bodies: simulator.bodies,
            createdBy: User.current._id,
            description: $scope.d.description,
            title: $scope.d.title
          }, onSuccess, onFailure);
    };

    function onSuccess(payload) {
      $scope.message = 'Saved simulation!';

      $q.all(simulator.notes.map(function(note) {
        note.simulation = payload._id;
        return Note.save({}, note);
      })).then(function() {
        $location.path('/s/' + payload._id);
        reset();
      }, function() {
        $scope.message = 'There was an error saving your notes. Please try again';
        $scope.didFail = true;
        $scope.isSaving = false;

        console.log('failed to save a note');
      });
    };

    function onFailure(err) {
      $scope.didFail = true;
      $scope.isRegistering = false;

      $scope.message = 'Unable to save simulation!';
    };

    function reset() {
      $scope.d = {};
      $scope.isSaving = false;
      $scope.didFail = false;
      $scope.message = null;

      $('#save-sim-modal').modal('hide');
    };
  }]);
