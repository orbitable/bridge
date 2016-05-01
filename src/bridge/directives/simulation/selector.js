var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('selectMarker', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {
        var selectorGroup = d3.select(elem[0]);
        function update(data) {
          // A conditional function that asserts if a body has a habitable zone
          var isSelected = (body) => body.id === scope.selectedBody.id;
          var selector = selectorGroup
            .selectAll('circle')
            .data(data.filter(isSelected));

          function drawSelector(selector) {

            //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
            selector
               .attr('id', "select-marker")
               .attr('cx', (d) => scope.xScale(d.position.x))
               .attr('cy', (d) => scope.yScale(d.position.y))
               .attr('r', (d) => scope.rScale(d.radius) + 10)
               .attr('fill-opacity', 0)
               .attr('stroke','white')
               .attr('stroke-width', (d) => scope.rScale(d.radius))
               .attr('stroke-opacity', 0.5);
          }

          drawSelector(selector);
          drawSelector(selector.enter().append('circle'));
          selector.exit().remove();
        }

        eventPump.register(() => update(simulator.bodies));
      }
    };
  }]);
