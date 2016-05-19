var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('trackerLine', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {
        var selectorGroup = d3.select(elem[0]);
        function update(data) {
          // A conditional function that asserts if a body has a habitable zone
          var isCenter = (body) => body.id === (simulator.orbitTracker.centerBody || {id: -1}).id;
          var getTargetBody = () => simulator.orbitTracker.targetBody || {position: {x:0,y:0}};
          
          var selector = selectorGroup
            .selectAll('line')
            .data(data.filter(isCenter));

          function drawSelector(selector) {

            //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
            selector
               .attr('id', "tracker-line")
               .attr('x1', (d) => scope.xScale(d.position.x))
               .attr('y1', (d) => scope.yScale(d.position.y))
               .attr('x2', (d) => scope.xScale(getTargetBody().position.x))
               .attr('y2', (d) => scope.xScale(getTargetBody().position.y))
               .attr('stroke','white')
               .attr('stroke-width', 3)
               .attr('stroke-dasharray',"10, 5")
               .attr('stroke-opacity', (simulator.orbitTracker.running ? 0.4 : 0.0));
          }

          drawSelector(selector);
          drawSelector(selector.enter().append('line'));
          selector.exit().remove();
        }

        eventPump.register(() => update(simulator.bodies));
      }
    };
  }]);
