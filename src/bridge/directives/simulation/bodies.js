var angular = require('angular');
var d3 = require('d3');

function getColor(d) {
  //Constant from Stefan-Boltzmann Law
  var sigma = 5.6704 * Math.pow(10,-8);
  var color = 'mistyrose';

  if (d !== null && d.luminosity > 0) {
    //convert solar units to watts for temp calculation
    var lum = d.luminosity * 3.827 * Math.pow(10,26);

    // this assumes that the radius is stored as the #.## term of #.## *10^8
    // meters, may need to change later
    var temp = Math.sqrt(lum / (4 * Math.PI * Math.pow(d.radius, 2) * sigma));

    if (temp >= 28000) {
      color = '#1a1aff';
    } else if (temp >= 10000) {
      color = '#80d4ff';
    } else if (temp >= 7500) {
      color = '#ffffff';
    } else if (temp >= 6000) {
      color = '#ffff80';
    } else if (temp >= 4900) {
      color = '#ffff1a';
    } else if (temp >= 3500) {
      color = '#ff6600';
    } else {
      color = '#ff0000';
    }
  } else {
    var mod = d.mass % 700;
    if (mod >= 600) {
      color = 'darkturquoise';
    } else if (mod >= 500) {
      color = 'darkseagreen';
    } else if (mod >= 400) {
      color = 'lightsalmon';
    } else if (mod >= 300) {
      color = 'plum';
    } else if (mod >= 200) {
      color = 'lightsteelblue';
    } else if (mod >= 100) {
      color = 'lightseagreen';
    } else {
      color = 'lightgreen';
    }
  }
  return color;
}

angular.module('bridge.directives')
  .directive('bodies', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      selectedBody: '=',
      link: function(scope, elem) {
        var bodyGroup = d3.select(elem[0]);

        // scope event propogation
        scope.zoom.on('zoom.bodies', function() {
          bodyGroup.attr('transform', 'translate(' + d3.event.translate + ')' +
                          ' scale(' + d3.event.scale + ')');

        });

        // TODO: Generalize this for all directives
        bodyGroup.call(scope.zoom.translate(scope.windowCenter).event);
        bodyGroup.call(scope.zoom.center(scope.windowCenter).event);
        bodyGroup.call(scope.zoom);

        function update(data) {
          var bodies = bodyGroup
            .selectAll('circle')
            .data(data);

          function drawBodies(bodies) {
            bodies
              .attr('cx', (d) => d.position.x / 1496000000)
              .attr('cy', (d) => d.position.y / 1496000000)
              .attr('r',  (d) => (Math.log((d.radius + 14961) / 14960)) / Math.LN10)
              .attr('fill', getColor)
              .attr('id', (d) => d.id)
              .on('mousedown', function(d) {
                d3.event.stopPropagation();
                scope.selectedBody = d;
                $('#right-sidebar').show();
              })
            .on('mouseover',function() {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('stroke', 'white')
                .attr('stroke-width',(d) => ((Math.log((d.radius + 14961) / 14960)) / Math.LN10) + 30);
            })
            .on('mouseout',function() {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('stroke-width',0);
            })
            .on('mousedown', function(d) {
              d3.event.stopPropagation();
              scope.selectedBody = d;
              $('#right-sidebar').show();

              lineData[d.id] = [];
            });

          }

          drawBodies(bodies);
          drawBodies(bodies.enter().append('circle'));
          bodies.exit().remove();
        }

        eventPump.register(() => update(simulator.bodies));
      }
    };
  }]);
