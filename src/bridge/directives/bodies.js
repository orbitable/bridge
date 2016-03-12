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
  .directive('bodies', ['$interval', 'eventPump', 'simulator', function($interval, eventPump, simulation) {
    return {
      scope: false, // use parent scope
      link: function(scope, elem, attr) {
        var svg = d3.select(elem[0])
          .append('svg')
          .attr('id', 'svg')
          .on('mousedown', function(){
            $('#right-sidebar').hide();
            scope.selectedBody = null;
          });

        var svgGroup = svg.append('g').attr('id', 'svgGroup');

        var axisGroup = svgGroup.append('g').attr('id', 'axisGroup');
        var zoneGroup = svgGroup.append('g').attr('id', 'zoneGroup');

        var bodyGroup = svgGroup.append('g').attr('id', 'bodyGroup');

        // TODO: Get dimensions from element
        var width  = document.getElementById('svg').offsetWidth;
        var height = document.getElementById('svg').offsetHeight;

        var x = d3.scale.linear()
          .domain([-width / 2, width / 2])
          .range([0, width]);

        var y = d3.scale.linear()
          .domain([-height / 2, height / 2])
          .range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(width/70)
          .orient("bottom")
          .tickSize(-height);

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(height/70)
          .tickSize(-width);

        var zoom = d3.behavior.zoom()
          .x(x)
          .y(y)
          .scaleExtent([0.1, 2])
          .on("zoom", function() {
            svg.select(".x.axis") .call(xAxis);
            svg.select(".y.axis").call(yAxis);
            bodyGroup.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            zoneGroup.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
          });

        svg.call(zoom);
        bodyGroup.call(zoom);

        axisGroup.append('g')
          .attr('id', 'xAxis')
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        axisGroup.append('g')
          .attr('id', 'yAxis')
          .attr("class", "y axis")
          .call(yAxis);

        eventPump.register(function() {
          bodyGroup.selectAll('*').remove();
          zoneGroup.selectAll('*').remove();

          var circle = bodyGroup.selectAll('circle').data(simulation.bodies);
          var zone = bodyGroup.selectAll('circle').data(simulation.bodies);

          var circleEnter = circle.enter()
            .append("circle")
            .attr('cx', function(d) {
              return d === null ? 0 : d.position.x / 1496000000;
            })
            .attr('cy', function(d) {
              return d === null ? 0 : d.position.y / 1496000000;
            })
            .attr('r', function(d) {
              return d === null ? 0 : Math.log10((d.radius + 14961) / 14960);
            })
            .attr('fill', function(d) {

              if (d!==null &&d.luminosity > 0 && d.radius > 0) {
                calcHabitableZone(d);
              }
              return getColor(d);
            })

            .on('mousedown', function(d){
              d3.event.stopPropagation();
              scope.selectedBody = d;
              $('#right-sidebar').show();
            });

            function getColor(d)
            {
               //Constant from Stefan-Boltzmann Law
               sigma = 5.6704* Math.pow(10,-8);
               //Uncomment the below line to test the changing of star colors based on luminostiy and radius
               //d.luminosity = 1

               if (d!==null&&d.luminosity>0  ) {
                    //convert solar units to watts for temp calculation
                    lum = d.luminosity *3.827*Math.pow(10,26);
                    //this assumes that the radius is stored as the #.## term of #.## *10^8 meters, may need to change later
                    rad = d.radius;
                    temp = Math.pow((lum/(4 *Math.PI* Math.pow(rad,2)*sigma)),.25);

                    if (temp>=28000) {
                      color = "#1a1aff";
                    }
                    else if (temp>=10000) {
                     color="#80d4ff"
                    }
                    else if (temp>=7500) {
                      color="#ffffff"
                    }
                    else if (temp>=6000) {
                      color="#ffff80"
                    }
                    else if (temp>=4900) {
                      color="#ffff1a"
                    }
                    else if (temp>=3500) {
                      color = "#ff6600"
                    }
                    else{
                      color ="#ff0000"
                    }
                  }
                  else{
                    var mod = d.mass % 700
                    color = "mistyrose"
                    if (mod >= 600) {
                        color="darkturquoise"
                    }
                    else if (mod >= 500) {
                        color="darkseagreen"
                    }
                    else if (mod >= 400) {
                        color="lightsalmon"
                    }
                    else if (mod >= 300) {
                        color="plum"
                    }
                    else if (mod >= 200) {
                        color="lightsteelblue"
                    }
                    else if (mod >= 100) {
                        color="lightseagreen"
                    }
                    else {
                        color="lightgreen"
                    }
                    
                  }
                  return color;
            }
            function calcHabitableZone(body)
            {
              //conversion factor for au to M
              auMConver = 1.496*Math.pow(10,11);


              //calculate the inner and outer radius
              innerRadius = Math.pow(body.luminosity / 1.1, 0.5) *auMConver;
              outerRadius = Math.pow(body.luminosity / 0.53, 0.5) *auMConver;
              innerRadius = innerRadius / 1496000000;
              outerRadius = outerRadius / 1496000000;

                //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
                zoneGroup.append("circle")
                 .attr("cx",body.position.x/1496000000)
                 .attr("cy",body.position.y/1496000000)
                 .attr("r",((outerRadius-innerRadius)/2+innerRadius))
                 .attr("fill-opacity",0)
                 .attr("stroke","green")
                 .attr("stroke-width",(outerRadius-innerRadius))
                 .attr("stroke-opacity",0.25);
             }
        });
      }
    };
  }]);
