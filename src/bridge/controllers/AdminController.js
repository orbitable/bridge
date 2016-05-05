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

angular.module('bridge.controllers')
  .controller('adminController', ['$scope', 'Scale', 'Simulation', 'simulator', 'User', 'eventPump', '$log', '$location',  function($scope, Scale, Simulation, simulator, User, eventPump, $log, $location) {
    $scope.user = User;

    this.add = function() {
      if (User.current && simulator.isEditable()) {
        var px, py = 0;
        var bodies = d3.select('#bodies');

        // add listener to svg
        var svg = d3.select('#svg')
        .on('mousemove', function() {
          var pt = d3.mouse(bodies[0][0]);
          drawGhost(bodies, pt[0], pt[1]);
        })
        .on('click', function() {

          var pt = d3.mouse(bodies[0][0]);
          var body = {
            position: {x: Scale.x.invert(pt[0]), y: Scale.y.invert(pt[1])},
          };
          $('#note-sidebar').hide();
          $('#tracker-sidebar').hide();
          $('#body-sidebar').show();
          var addedBody = simulator.addBody(body);
          $scope.$parent.selectedNote = {};
          $scope.$parent.selectedBody = addedBody;
          eventPump.step(false,true);
          console.log($scope.$parent.selectedBody);
          $scope.$apply();

          // clear listeners and ghost circle
          svg.on('mousemove', null);
          svg.on('click', null);
          svg.selectAll('#ghost').remove();
        });
      }
    };


    this.addNote = function() {
      if (User.current) {
        var px, py = 0;
        var bodies = d3.select('#bodies');

        // add listener to svg
        var svg = d3.select('#svg')
        .on('mousemove', function() {
          var pt = d3.mouse(bodies[0][0]);
          drawGhostNote(bodies, pt[0], pt[1]);
        })
        .on('click', function() {
        var pt = d3.mouse(bodies[0][0]);
        var note = {
          position: {x: Scale.x.invert(pt[0]), y: Scale.y.invert(pt[1])},
        };
        $(function() {
          $('[data-toggle="tooltip"]').tooltip();
        });
        $('#tracker-sidebar').hide();
        $('#body-sidebar').hide();
        $('#note-sidebar').show();
        var addedNote = simulator.addNote(note);
        $scope.$parent.selectedNote = addedNote;
        $scope.$parent.selectedBody = {};
        eventPump.step(false,true);
        console.log($scope.$parent.selectedNote);

        // clear listeners and ghost circle
        svg.on('mousemove', null);
        svg.on('click', null);
        svg.selectAll('#ghost').remove();

      });
      }
    };

    // Used by addBody. draws a circle that follows cursor.
    function drawGhost(svg, x, y) {
      // select existing (at first this will be empty)
      var ghost = svg.selectAll('#ghost');

      //bind data. create ghost if it doesn't exist
      ghost.data([[x,y]]).enter().append('circle').attr('id', 'ghost');
      ghost.attr({
        'cx': function(d) {
          return d[0];
        },
        'cy': function(d) {
          return d[1];
        },
        'r': 4,
        'fill': 'white',
        'id': 'ghost',
        'opacity': '0.7',
      });
    }

      function drawGhostNote(svg, x, y) {
      // select existing (at first this will be empty)
      var ghost = svg.selectAll('#ghost');

      //bind data. create ghost if it doesn't exist
      ghost.data([[x,y]]).enter().append('rect').attr('id', 'ghost');
      ghost.attr({
        'x': function(d) {
          return d[0]-6;
        },
        'y': function(d) {
          return d[1]-6;
        },
        'width': 12,
        'height': 12,
        'fill-opacity': '0.0',
        'id': 'ghost',
        'stroke': 'grey',
        'stroke-width':2,
      });
    }

    this.tip = function() {
      $log.debug('tip function()');
    };
    this.record = function() {
      $log.debug('record function()');
    };
  }]);
