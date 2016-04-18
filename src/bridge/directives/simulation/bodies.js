var angular = require('angular');
var d3 = require('d3');

var BodiesDirective = function(eventPump, simulator, Scale, User) {
  return {
    scope: false,
    link: function(scope, elem) {

      var bodyGroup = d3.select(elem[0]);
      var bodies = d3.select('#bodies');

      // Set up dragging for the bodies
      var drag = d3.behavior.drag()
        .on('drag', function(d) {
          if (eventPump.paused && User.current) {
            var pt = d3.mouse(bodies[0][0]);
            d3.select(this)
              .attr('cx', (pt[0]))
              .attr('cy', (pt[1]));
          }
        })
        .on('dragend', function(d) {
          if (eventPump.paused && User.current) {
            var pt = d3.mouse(bodies[0][0]);
            var body = {
              position: {x: Scale.x.invert(pt[0]), y: Scale.y.invert(pt[1])},
            };
            simulator.updateBody(d.id, body);
            eventPump.step();
          }
        });

      function update(data) {
        var bodies = bodyGroup
          .selectAll('circle')
          .data(data);

        function drawBodies(bodies) {
          bodies
            .call(drag)
            .attr('cx', (d) => scope.xScale(d.position.x))
            .attr('cy', (d) => scope.yScale(d.position.y))
            .attr('r',  (d) => scope.rScale(d.radius))
            .attr('fill', (d) => d.color)
            .on('mouseover',function() {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('stroke', 'white')
                .attr('stroke-width',(d) => (scope.rScale(d.radius)) + 30);
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
            simulator.selectedBody = d;
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
};

// List dependencies to be injected
BodiesDirective.$inject = ['eventPump', 'simulator', 'Scale', 'User'];

// Register Directive
angular.module('bridge.directives')
  .directive('bodies', BodiesDirective);
