
var angular = require('angular');
var lineData = [];
var delayCount = 0;
var MAX_PATH = 300;

angular.module('bridge.directives')
    .directive('bodies', ['$interval', 'eventPump', 'simulator', function($interval, eventPump, simulation) {
      return {
        link: function(scope, elem, attr) {
          var svg = d3.select(elem[0])
              .append('svg')
              .attr('id', 'svg');

          var svgGroup = svg.append('g')
              .attr('id', 'svgGroup');

          var bodyGroup = svgGroup.append('g')
              .attr('id', 'bodyGroup');


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
                svg.select(".x.axis").call(xAxis);
                svg.select(".y.axis").call(yAxis);
                bodyGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
              });

          svg.call(zoom);
          bodyGroup.call(zoom);

          svgGroup.append('g')
              .attr('id', 'xAxis')
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svgGroup.append('g')
              .attr("class", "y axis")
              .call(yAxis);

          $interval(function () {
            console.log(simulation.bodies);
          }, 1000);

          for (i = 0; i < simulation.bodies.length; i++) {
            var temp = [];
            lineData.push(temp);
          }


          // Color scale
          var color_scale = d3.scale.ordinal()
              .range(["blue","green","yellow","red","orange","cyan","magenta"]) // 7 items
              .domain(d3.range(0,7));


          // Render paths function

          function render_path(index){

            //The data from the object is pushed onto the array
            if(delayCount > 5) {

              try {
                if (lineData[index].length >= MAX_PATH) {
                  lineData[index] = [];
                } else {
                  lineData[index].push({x: simulation.bodies[index].position.x, y: simulation.bodies[index].position.y});
                }
              }
              catch (e) {
                lineData[index] = [];
              }
            }
            //This is the accessor function we talked about above
            var lineFunction = d3.svg.line()
                .x(function (d) {
                  return d.x;
                })
                .y(function (d) {
                  return d.y;
                })
                .interpolate("basis");


            //The SVG Container
            var svgContainer = bodyGroup;

            //The line SVG Path we draw
            var lineGraph = svgContainer.append("path")
                .attr("d", lineFunction(lineData[index]))
                .attr("stroke", color_scale(index))
                .attr("stroke-width", 2)
                .attr("fill", "none");

       //     d3.select("path")
       //         .transition()
       //         .duration(500)
       //         .attr("stroke", "hsl(" + (Math.random() * 360) + ",100%,50%)")

          }


          eventPump.register(function() {
            bodyGroup.selectAll('*').remove();

            delayCount += 1;
            for (i = 0; i < simulation.bodies.length; i++) {

              render_path(i);

            }
            if (delayCount > 5){delayCount = 0;}


            var circle = bodyGroup.selectAll('circle').data(simulation.bodies);
            var circleEnter = circle.enter()
                .append("circle")
                .attr('cx', function(d) {
                  return d === null ? 0 : d.position.x;
                })
                .attr('cy', function(d) {
                  return d === null ? 0 : d.position.y;
                })
                .attr('r', function(d) {
                  return d === null ? 0 : d.radius;
                })
                .attr('fill', function(d) {
                  return 'red';
                });
          });
        }
      };
    }]);
