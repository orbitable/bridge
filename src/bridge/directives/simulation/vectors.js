var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('vectors', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {

        var vectorGroup = d3.select(elem[0])
            .attr('id', 'vectorGroup');

        scope.zoom.on('zoom.vectors', function() {
          vectorGroup.attr('transform', 'translate(' + d3.event.translate + ')' +
                          ' scale(' + d3.event.scale + ')');
        });

        // TODO: Generalize this for all directives
        vectorGroup.call(scope.zoom.translate(scope.windowCenter).event);
        vectorGroup.call(scope.zoom);

        // Render the vectors
        function getVectorData(index, body) {

          var bodyPosition = {
            x: scope.xScale(body.position.x),
            y: scope.yScale(body.position.y),
          };
          var bodyVelocity = {
            x: body.velocity.x / 1000,
            y: body.velocity.y / 1000
          };

          var bodyRadius = (Math.log((body.radius + 14961) / 14960)) / Math.LN10;

          var x1 = bodyPosition.x;
          var x2 = (bodyPosition.x + bodyVelocity.x) + bodyRadius * 2;
          var y1 = bodyPosition.y;
          var y2 = (bodyPosition.y + bodyVelocity.y) + bodyRadius * 2;

          //  d3.select('svg').on('mousedown.zoom',null);
          // zoom.on("zoom",null);
          // selection.call(zoom);

          var dragLine = d3.behavior.drag()
                .on('dragstart', function() {
                  d3.select('svg').on('mousedown.zoom',null);
                d3.select(this).style('stroke', 'white'); })
                .on('drag', function() {
                  d3.select(this).attr('x2', d3.event.x);
                  d3.select(this).attr('y2', d3.event.y);

                  simulator.bodies[index].update({
                    velocity: {
                      x: (d3.event.x - (bodyPosition.x) - bodyRadius * 2) * 1000,
                      y: (d3.event.y - (bodyPosition.y) - bodyRadius * 2) * 1000
                    }
                  });
                })
                .on('dragend', function() {
                  scope.svg.call(scope.zoom);
                  d3.select(this).style('stroke', 'grey');
                  console.log(d3.select(this).attr('id'));
                  console.log(d3.select(this).attr('x2'));
                  console.log(d3.select(this).attr('y2'));
                });

          //             Draw an arrow to use for lines
          vectorGroup.append('defs')
              .append('marker')
              .attr('id', 'arrow')
              .attr('viewBox', '0 0 10 10')
              .attr('refX', 0)
              .attr('refY', 5)
              .attr('markerUnits', 'strokeWidth')
              .style('stroke', 'grey')
              .style('fill', 'grey')
              .attr('markerWidth', 1)
              .attr('markerHeight', 1)
              .attr('orient', 'auto')
              .append('path')
              .attr('d', 'M 0 0 L 10 5 L 0 10 z');

          vectorGroup.append('svg:line')
              .attr('class', 'draggableLine')
              .attr('id', index)
              .attr('x1', x1)
              .attr('x2', x2)
              .attr('y1', y1)
              .attr('y2', y2)
              .on('mousedown', function(d) {
                d3.event.stopPropagation();
                scope.selectedBody = body;
                $('#right-sidebar').show();
              })
              .call(dragLine)
              .style('stroke', 'grey')
              .attr('stroke-width', bodyRadius * 2)
              .attr('marker-end', 'url(\#arrow)')
              .on('mouseup', function(d) {
                // body.velocity.x = ((d3.select(this).attr('x2')*1000)*1496000000);
                // body.velocity.y = ((d3.select(this).attr('y2')*1000)*1496000000);
                // d3.event.stopPropagation();
                scope.selectedBody = body;
                $('#right-sidebar').show();
              });

        }

        eventPump.register(function() {
          simulator.bodies.forEach(function(body) {
            if (eventPump.paused) {
              getVectorData(simulator.bodies.indexOf(body),body);
            } else {
              vectorGroup.selectAll('*').remove();
            }
          });

        });
      }
    };
  }]);
