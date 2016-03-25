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
var lineData = [];
var delayVal = 10;
var delayCount = 0;
var MAX_PATH = 500;
var pathIndex = [];

function getColor(d) {
  //Constant from Stefan-Boltzmann Law
  var sigma = 5.6704* Math.pow(10,-8);
  var color = 'mistyrose';

  if (d !== null && d.luminosity > 0) {
    //convert solar units to watts for temp calculation
    var lum = d.luminosity *3.827*Math.pow(10,26);
    //this assumes that the radius is stored as the #.## term of #.## *10^8 meters, may need to change later
    var temp = Math.sqrt(lum / (4 * Math.PI * Math.pow(d.radius, 2) * sigma));

    if (temp>=28000) {
      color = "#1a1aff";
    } else if (temp>=10000) {
      color="#80d4ff";
    } else if (temp>=7500) {
      color="#ffffff";
    } else if (temp>=6000) {
      color="#ffff80";
    } else if (temp>=4900) {
      color="#ffff1a";
    } else if (temp>=3500) {
      color = "#ff6600";
    } else {
      color = "#ff0000";
    }
  } else {
    var mod = d.mass % 700;
    if (mod >= 600) {
      color="darkturquoise";
    } else if (mod >= 500) {
      color="darkseagreen";
    } else if (mod >= 400) {
      color="lightsalmon";
    } else if (mod >= 300) {
      color="plum";
    } else if (mod >= 200) {
      color="lightsteelblue";
    } else if (mod >= 100) {
      color="lightseagreen";
    } else {
      color="lightgreen";
    }
  }
  return color;
}

angular.module('bridge.directives')
  .directive('bodies', ['eventPump', 'simulator', function(eventPump, simulation) {
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
        var zonesGroup = svgGroup.append('g').attr('id', 'zonesGroup');
        var linesGroup = svgGroup.append('g').attr('id', 'linesGroup');
        var bodyGroup = svgGroup.append('g').attr('id', 'bodyGroup');
        var rulerGroup = svgGroup.append('g')
        .attr('id', 'rulerGroup')
        .attr('visibility','hidden');
        // Get bounding rect for the element
        var rect = elem[0].firstChild.getBoundingClientRect();
        var width  = rect.width;
        var height = rect.height;

        var x = d3.scale.linear()
          .domain([-width / 2, width / 2])
          .range([0, width]);

        var y = d3.scale.linear()
          .domain([-height / 2, height / 2])
          .range([height, 0]);

          
          var rulerScale = d3.scale.linear()
            .domain([0,0])
            .range([0, 0]);     
          
          var rulerAxis = d3.svg.axis()
            .scale(rulerScale)
            .ticks(10)
            .tickSize(-25);
            
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
          .scaleExtent([0.1, 6])
          .on("zoom", function() {
            svg.select(".x.axis") .call(xAxis);
            svg.select(".y.axis").call(yAxis);
            bodyGroup.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            zonesGroup.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            linesGroup.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            rulerGroup.attr("transform", " translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
 });


        // Translate the svg to the center of the element.
        //
        // Any group of elements which respond to zoom/pan must be translated
        // and centered.
        var windowCenter = [width/2, height/2];
        [svg, bodyGroup, zonesGroup, linesGroup].forEach(function(group) {
          group.call(zoom.translate(windowCenter).event);
          group.call(zoom.center(windowCenter).event);
          group.call(zoom);
        });

        axisGroup.append('g')
          .attr('id', 'xAxis')
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        axisGroup.append('g')
          .attr('id', 'yAxis')
          .attr("class", "y axis")
          .call(yAxis);
          
          
        var origPos = [0,0];
        var rulerSet = true;
          
        svg.on("click", function(d) {
          if (d3.select("#btn_ruler").property("className").indexOf("toggleOn") > -1) {
            if (!rulerSet) {
              rulerSet = true;
            } else {
              origPos = d3.mouse(this); 
              rulerSet = false;
            }
          }
        });

        svg.on("mousemove", function(d) { 
          if (d3.select("#btn_ruler").property("className").indexOf("toggleOn") > -1) {      
            if (!rulerSet) {
              var pos = d3.mouse(this);
              var angle = Math.atan((pos[1]-origPos[1])/(pos[0]-origPos[0]))/Math.PI*180 || 0;

              rulerGroup.select('g').remove();

              var x2 = Math.pow((origPos[1]-pos[1]),2);
              var y2 = Math.pow((origPos[0]-pos[0]),2);
              var dist = Math.sqrt(x2 + y2)/zoom.scale();
              var range = origPos[0] > pos[0] ? [-dist, 0] : [dist, 0];

              rulerScale
                .domain([dist, 0])
                .range(range);
              
              rulerGroup.select('g').remove();

              var rulerAxis = d3.svg.axis()
               .scale(rulerScale)
               .ticks(Math.floor(dist/35))
               .tickSize(25);
              
              var trans = d3.transform(rulerGroup.attr("transform")).translate;
                         
              var xpos = (origPos[0]-trans[0])/zoom.scale();
              var ypos = (origPos[1]-trans[1])/zoom.scale();
                
                
              rulerGroup.append('g')
                .attr('id', 'xAxis')
                .attr("class", "ruler")
                .attr("transform", "translate("+xpos+"," +ypos + ") rotate(" + angle + ")")
                .call(rulerAxis);
            } 
          } else {
            rulerGroup.select('g').remove();
            rulerSet = true;
          }
           
        });
         
        function update(data) {
          var bodies = bodyGroup
            .selectAll('circle')
            .data(data);

          // A conditional function that asserts if a body has a habitable zone
          var isHabitable = (body) => body !== null && body.luminosity > 0 && body.radius > 0;
          var zones = zonesGroup
            .selectAll('circle')
            .data(data.filter(isHabitable));

          var lines = linesGroup
            .selectAll('path')
            .data(lineData);
          
          // Color scale
          var colors = ["blue","green","yellow","red","orange","cyan","magenta"];
          var colorScale = d3.scale.ordinal()
            .range(colors) 
            .domain(d3.range(0,colors.length));
              
          //This is the accessor function
          var lineFunction = d3.svg.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .interpolate("basis");

          // Adds or removes a body index from the array to render
          function addPath(pathIdx){
              if(jQuery.inArray(pathIdx, pathIndex) == -1) {
                pathIndex.push(pathIdx);
              } else {
                pathIndex.splice(pathIdx, 1);
              }
          }

          // Render paths function
          function renderPath(index){
            //The data from the object is pushed onto the array
            if(delayCount > delayVal) {
              // Use a new array if none exists or if it is too large
              if (!lineData[index] || lineData[index].length >= MAX_PATH) {
                lineData[index] = [];
              } else {
                lineData[index].push({
                  x: simulation.bodies[index].position.x / 1496000000,
                  y: simulation.bodies[index].position.y / 1496000000
                });
              }
            }
          }

          // Calls the render path function for each path index
          delayCount += 1;
          pathIndex.forEach(renderPath);

          if (delayCount > delayVal) {
            delayCount = 0;
          }

          function drawBody(bodies) {
            bodies
              .attr('cx', (d) => d.position.x / 1496000000)
              .attr('cy', (d) => d.position.y / 1496000000)
              .attr('r',  (d) => (Math.log((d.radius + 14961) / 14960)) / Math.LN10)
              .attr('fill', getColor)
              .on('mousedown', function(d){
                d3.event.stopPropagation();
                scope.selectedBody = d;
                $('#right-sidebar').show();
              })
            .on('mouseover',function() {
              d3.select(this)
                .transition()
                .duration(50)
                .attr("stroke", "orange")
                .attr('stroke-width',5);
            })
            .on('mouseout',function () {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('stroke-width',0);
            })
            .on('mousedown', function(d){
              d3.event.stopPropagation();
              scope.selectedBody = d;
              $('#right-sidebar').show();

              addPath(simulation.bodies.indexOf(d));
            });

          }

          function drawHabitableZone(zones) {
              //conversion factor for au to M
              var auMConver = 1.496*Math.pow(10,11);

              // calculate the inner and outer radius
              // TODO: get rid of magic numbers
              var innerRadius = (d) => (Math.pow(d.luminosity / 1.1, 0.5) * auMConver) / 1496000000;
              var outerRadius = (d) => (Math.pow(d.luminosity / 0.53, 0.5) * auMConver) / 1496000000;

              //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
              zones
                 .attr("cx", (d) => d.position.x / 1496000000)
                 .attr("cy", (d) => d.position.y / 1496000000)
                 .attr("r", (d) => ((outerRadius(d)-innerRadius(d))/2+innerRadius(d)))
                 .attr("fill-opacity", 0)
                 .attr("stroke","green")
                 .attr("stroke-width", (d) => (outerRadius(d)-innerRadius(d)))
                 .attr("stroke-opacity", 0.25);
          }

          function drawLines(lines) {
            lines
              .attr('d', (d) => d ? lineFunction(d) : '')
              .attr("stroke", colorScale)
              .attr("stroke-width", 1)
              .attr("fill", "none")
              .on('mouseover', function () {
                d3.select(this)
                  .transition()
                  .duration(50)
                  .attr("stroke", "green")
                  .attr('stroke-width', 5);
              })
              .on('mouseout', function () {
                d3.select(this)
                  .transition()
                  .duration(500)
                  .attr("stroke", colorScale(index))
                  .attr('stroke-width', 1);
              });
          }

          // Update existing
          drawBody(bodies);
          drawHabitableZone(zones);
          drawLines(lines);

          // Add new
          drawBody(bodies.enter().append('circle'));
          drawHabitableZone(zones.enter().append('circle'));
          drawLines(lines.enter().append('path'));

          // Remove missing
          [bodies, zones, lines].forEach((g) => g.exit().remove());
        }

        eventPump.register(() => update(simulation.bodies));
      }
    };
  }]);
