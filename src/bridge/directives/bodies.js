
var angular = require('angular');
var delay_counter = 0;
var lineData = [];

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

        eventPump.register(function() {
          bodyGroup.selectAll('*').remove();

          //#### RENDERING #####


          //The data for our line
          delay_counter = delay_counter + 1;

          if(delay_counter > 10){

            delay_counter = 0;
          //  lineData.push({ "x": simulation.bodies[0].position.x,   "y": simulation.bodies[0].position.y});
            lineData.push({ "x": simulation.bodies[1].position.x,   "y": simulation.bodies[1].position.y});
            console.log(simulation.bodies[0].position.x);

          }

          //This is the accessor function
          var lineFunction = d3.svg.line()
                                   .x(function(d) { return d.x; })
                                   .y(function(d) { return d.y; })
                                   .interpolate("linear");

          //The line SVG Path
          var lineGraph = bodyGroup.append("path")
                                      .attr("d", lineFunction(lineData))
                                      .attr("stroke", "green")
                                      .attr("stroke-width", 2)
                                      .attr("fill", "none");


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
              if(d.radius < 20){
                return 'red';
              } else{return 'yellow';}

            })
          .on("click", function(){console.log('TESTING ALL THE THINGS!!!!!!!!!!!!!!');});
            //  .on("click", function(){d3.select(this).style("fill", "magenta");});
        });
      }
    };
  }]);
