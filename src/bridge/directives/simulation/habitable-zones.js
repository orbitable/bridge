var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('habitableZones', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {
        var zoneGroup = d3.select(elem[0]);

        scope.zoom.on('zoom.zones', function() {
          zoneGroup.attr('transform', 'translate(' + d3.event.translate + ')' +
                          ' scale(' + d3.event.scale + ')');
        });

        // TODO: Generalize this for all directives
        zoneGroup.call(scope.zoom.translate(scope.windowCenter).event);
        zoneGroup.call(scope.zoom.center(scope.windowCenter).event);
        zoneGroup.call(scope.zoom);

        function update(data) {
          // A conditional function that asserts if a body has a habitable zone
          var isHabitable = (body) => body !== null && body.luminosity > 0 && body.radius > 0;
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
               .attr('cx', (d) => d.position.x / 1496000000)
               .attr('cy', (d) => d.position.y / 1496000000)
               .attr('r', (d) => ((outerRadius(d) - innerRadius(d)) / 2 + innerRadius(d)))
               .attr('fill-opacity', 0)
               .attr('stroke','green')
               .attr('stroke-width', (d) => (outerRadius(d) - innerRadius(d)))
               .attr('stroke-opacity', 0.25);
          }

          drawHabitableZone(zones);
          drawHabitableZone(zones.enter().append('circle'));
          zones.exit().remove();
        }

        eventPump.register(() => update(simulator.bodies));
      }
    };
  }]);
