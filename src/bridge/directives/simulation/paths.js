var angular = require('angular');
var d3 = require('d3');

var lineID = 0;
var lineMaxCount = 5;
var delayVal = 10;
var delayCount = 0;
var MAX_PATH = 300;

angular.module('bridge.directives')
  .directive('paths', ['eventPump', 'Paths', 'simulator', function(eventPump, Paths, simulator) {
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
          .interpolate('cardinal');

        function update(data) {
          var l = Object.keys(data).reduce(function(acc, k) {
            acc.push(data[k].data);
            return acc;
          }, []);

          var paths = pathsGroup
            .selectAll('path')
            .data(l);

          function drawPaths(paths) {
            paths
              .attr('d', (d) => d ? lineFunction(d) : '')
              // TODO: Update coloring
              .attr('stroke', (d) => d.color)
              .attr('stroke-opacity',0.5)
              .attr('stroke-width', 1)
              .attr('fill', 'none');
          }

          drawPaths(paths);
          drawPaths(paths.enter().append('path'));
          paths.exit().remove();
        }

        eventPump.register(() => update(Paths.data));
        eventPump.register(function() {
          Paths.data.forEach(function(path) {
            path.data.pop();
            path.data.push({
              x: scope.xScale(path.body.position.x),
              y: scope.yScale(path.body.position.y),
            });
          });

          if (delayCount > delayVal) {
            Paths.data.forEach(function(path) {
              path.data.color = path.body.color;

              if (path.data.length > MAX_PATH) {
                path.data.shift();
              }

              path.data.push({
                x: scope.xScale(path.body.position.x),
                y: scope.yScale(path.body.position.y),
              });

            });

            delayCount = 0;
          }

          delayCount++;
        });
      }
    };
  }]);
