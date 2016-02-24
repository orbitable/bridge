
var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodies', ['$interval', 'eventPump', function($interval, eventPump) {
    return {
      link: function(scope, elem, attr) {
        var svg = d3.select(elem[0])
          .append('svg')
          .attr('id', 'svg');

        var svgGroup = svg.append('g')
          .attr('id', 'svgGroup');

        var bodyGroup = svgGroup.append('g')
          .attr('id', 'bodyGroup');

        svgGroup.append('g')
          .attr('id', 'xAxis')
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0,' + 0 + ')');

        svgGroup.append('g')
          .attr('id', 'yAxis')
          .attr("class", "y-axis");
      }
    };
  }]);
