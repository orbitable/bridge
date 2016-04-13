var angular = require('angular');
var d3 = require('d3');

// TODO: This is bad; Correct it
var lineData = {};
var delayVal = 10;
var delayCount = 0;
var MAX_PATH = 500;

angular.module('bridge.directives')
  .directive('paths', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {
        var pathsGroup = d3.select(elem[0]);

        // Color scale
        var colors = ['blue','green','yellow','red','orange','cyan','magenta'];
        var colorScale = d3.scale.ordinal()
          .range(colors)
          .domain(d3.range(0,colors.length));

        //This is the accessor function
        var lineFunction = d3.svg.line()
          .x((d) => d.x)
          .y((d) => d.y)
          .interpolate('linear');

        function update(data) {
          var l = Object.keys(data).reduce(function(acc, k) {
            acc.push(data[k]);
            return acc;
          }, []);

          var paths = pathsGroup
            .selectAll('path')
            .data(l);

          function draw(paths) {
            paths
              .attr('d', (d) => d ? lineFunction(d) : '')
              // TODO: Update coloring
              .attr('stroke', (d) => colorScale(d.id))
              .attr('stroke-width', 1)
              .attr('fill', 'none')
              .on('mouseover', function() {
                d3.select(this)
                  .transition()
                  .duration(50)
                  .attr('stroke', 'green')
                  .attr('stroke-width', 5);
              })
              .on('mouseout', function() {
                d3.select(this)
                  .transition()
                  .duration(500)
                  .attr('stroke-width', 1);
              });
          }

          draw(paths);
          draw(paths.enter().append('path'));
          paths.exit().remove();
        }

        eventPump.register(() => update(lineData));
        eventPump.register(function() {

          if (delayCount > delayVal) {
            simulator.bodies.forEach(function(body) {
              if (lineData[body.id]) {
                if (lineData[body.id].length > MAX_PATH) {
                  lineData[body.id] = [];
                }

                lineData[body.id].push({
                  x: scope.xScale(body.position.x),
                  y: scope.yScale(body.position.y)
                });
              }
            });

            delayCount = 0;
          }

          delayCount++;
        });
      }
    };
  }]);
