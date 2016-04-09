var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('axis', function() {
    return {
      link: function(scope, elem) {
        var axisGroup = d3.select(elem[0]);

        var xAxis = d3.svg.axis()
          .scale(scope.xScale)
          .ticks(5)
          .orient('bottom')
          .tickSize(-scope.height);

        var yAxis = d3.svg.axis()
          .scale(scope.yScale)
          .ticks(5)
          .orient('left')
          .tickSize(-scope.width);

        axisGroup
          .append('g')
          .attr('id', 'xAxis')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0, ' + scope.height + ')')
          .call(xAxis);

        axisGroup
          .append('g')
          .attr('id', 'yAxis')
          .attr('class', 'y axis')
          .call(yAxis);

        scope.zoom.on('zoom', function() {
          scope.svg.select('.x.axis').call(xAxis);
          scope.svg.select('.y.axis').call(yAxis);
        });
      },
    };
  });
