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
  .controller('adminController', ['$scope', 'Simulation', 'simulator', 'User', 'eventPump', function($scope, Simulation, simulator, User, eventPump) {
    $scope.user = User;

    this.add = function() {

      var px, py = 0;
      // add listener to svg
      var svg = d3.select('#svg')
      .on('mousemove', function() {
        var pt = d3.mouse(this);
        px = pt[0];
        py = pt[1];
        drawGhost(svg, pt[0], pt[1]);
      })
      .on('click', function() {
        // TODO: move translation responsibility to a parent entity

        // Get bounding rect for the element
        var elem = document.getElementById('svg');
        var transform = /\(([^)]+)\)/.exec(d3.select('#bodies').attr('transform'))[1].split(',');
        var rect = elem.getBoundingClientRect();
        var width  = rect.width;
        var height = rect.height;
        var ox = width / 2;
        var oy = height / 2;
        var tx = (px - ox) * 1496000000;
        var ty = (py - oy) * 1496000000;
        var body = {
          position: {x: tx, y: ty},
        };
        console.log(transform);
        simulator.addBody(body);
        eventPump.step();

        // clear listeners and ghost circle
        svg.on('mousemove', null);
        svg.on('click', null);
        svg.selectAll('#ghost').remove();
      });

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

    this.save = function() {
      console.log('save function()');
    };
    this.tip = function() {
      console.log('tip function()');
    };
    this.record = function() {
      console.log('record function()');
    };
  }]);
