
var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodies', ['$interval', 'eventPump', 'simulator', function($interval, eventPump, simulation) {
    return {
      link: function(scope, elem, attr) {
        var svg = d3.select(elem[0])
          .append('svg')
          .attr('id', 'svg');

        var svgGroup = svg.append('g').attr('id', 'svgGroup');

        var axisGroup = svgGroup.append('g').attr('id', 'axisGroup');

        var bodyGroup = svgGroup.append('g').attr('id', 'bodyGroup');

        // selecting bodies
          bodyGroup.on("mousedown", function(d) {
            // stops event from propogating up the DOM
          console.log("clicked", d);
          d3.selectAll("circle").style("opacity", "0.2");
          d3.event.stopPropagation();
          // d3.select(this).style("opacity", "1");
          // prepareToDeselect = false;
          // scope.$apply(function() {
          //   scope.currentBody = d;
          // });
        });

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
            bodyGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
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
              return 'white';
            })
            // .call(drag);
        });
        // var drag = d3.behavior.drag()
        // .on("drag", dragmove);
        //
        // function dragmove(d) {
        //   var x = d3.event.x;
        //   var y = d3.event.y;
        //   console.log("drag");
        //   d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
        // }
      }
    };
  }]);
