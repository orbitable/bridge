var angular = require('angular');
var d3 = require('d3');

var BodiesDirective = function(eventPump, simulator, Scale, User) {
  return {
    scope: false,
    link: function(scope, elem) {
      // TODO: Properly resolve the initial resolution of selected body
      scope.selectedBody = {};

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
            eventPump.step(false,true);
          }
        });

      function update(data) {
        var bodies = bodyGroup
          .selectAll('circle')
          .data(data);
          
        function isSelected(body) {
          if (body && scope.selectedBody ) {
            return body.id === scope.selectedBody.id;
          }

          return false;
        }

        function drawBodies(bodies) {
          bodies
            .attr('cx', (d) => scope.xScale(d.position.x))
            .attr('cy', (d) => scope.yScale(d.position.y))
            .attr('r',  (d) => scope.rScale(d.radius))
            .attr('fill', (d) => d.color)
            .attr('stroke', (d) => ( isSelected(d) ? 'white' : 'darkgrey' ))
            .attr('stroke-width',(d) => ( isSelected(d) ? (scope.rScale(d.radius) + 30) : 0 ))
            .call(drag)
            .on('mouseover',function() {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('stroke-width',(d) => scope.rScale(d.radius) + 30);
            })
          .on('mouseout',function() {
            d3.select(this)
              .transition()
              .duration(500)
              .attr('stroke-width',(d) => ( isSelected(d) ? (scope.rScale(d.radius) + 30) : 0 ));
          })
          .on('mousedown', function(d) {
            d3.event.stopPropagation();
            scope.selectedBody = d;
            simulator.selectedBody = d;
            $('#right-sidebar').show();

            eventPump.step(false,true);
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
