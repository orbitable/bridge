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
  .controller('adminController', ['$scope', 'Simulation', 'simulator', function($scope, Simulation, simulator) {
    $scope.admin = true;
    this.add = function() {

      var px, py = 0;
      // add listener to svg
      var svg = d3.select("#svg")
      .on('mousemove', function(){
        var pt = d3.mouse(this);
        px = pt[0];
        py = pt[1];
        drawGhost(svg, pt[0], pt[1]);
      })
      .on('click', function(){
        var body = {
          mass: 9999999999999999999999999999999,
          position: {x: px*1496000000, y: py*1496000000},
          radius: 9999999999,
          velocity: {x: 0, y: 0},
        };
        console.log(px,py);
        simulator.addBody(body);

        // clear listeners and ghost circle
        svg.on('mousemove', null);
        svg.on('mouseclick', null);
        svg.selectAll("#ghost").remove();
      });

    };

    // Used by addBody. draws a circle that follows cursor.
    function drawGhost(svg, x, y){
      // select existing (at first this will be empty)
      var ghost = svg.selectAll("#ghost");

      //bind data. create ghost if it doesn't exist
      ghost.data([[x,y]]).enter().append("circle").attr("id", "ghost");
      ghost.attr({
        "cx": function(d){
          return d[0];
        },
        "cy": function(d){
          return d[1];
        },
        "r": 7,
        "fill": "white",
        "id": "ghost",
        "opacity": "0.5",
      });
    }

    this.remove = function() {
      console.log("remove function()");
    };
    this.save = function() {
      console.log("save function()");
    };
    this.tip = function() {
      console.log("tip function()");
    };
    this.record = function() {
      console.log("record function()");
    };
  }]);
