var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('habitableZones', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {
        var zoneGroup = d3.select(elem[0]);

        function update(data) {
          // A conditional function that asserts if a body has a habitable zone
          var isHabitable = (body) => body !== null && body.luminosity > 0 && body.radius > 0 && !body.hideHabitable;
          var zones = zoneGroup
            .selectAll('circle')
            .data(data.filter(isHabitable));

          function drawHabitableZone(zones) {
            //conversion factor for au to M
            var auMConver = 1.496 * Math.pow(10,11);

            // calculate the inner and outer radius
            // TODO: get rid of magic numbers
            var innerRadius = (d) => (Math.pow(d.luminosity / 1.1, 0.5) * auMConver) / 1496000000;
            var outerRadius = (d) => (Math.pow(d.luminosity / 0.53, 0.5) * auMConver) / 1496000000;

            //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
            zones
               .attr('id', "habitable-zones")
               .attr('cx', (d) => scope.xScale(d.position.x))
               .attr('cy', (d) => scope.yScale(d.position.y))
               .attr('r', (d) => ((outerRadius(d) - innerRadius(d)) / 2 + innerRadius(d)))
               .attr('fill-opacity', 0)
               .attr('stroke','#02668D')
               .attr('stroke-width', (d) => (outerRadius(d) - innerRadius(d)))
               .attr('stroke-opacity', 0.50);
          }

          drawHabitableZone(zones);
          drawHabitableZone(zones.enter().append('circle'));
          zones.exit().remove();
        }

        eventPump.register(() => update(simulator.bodies));
      }
    };
  }]);
