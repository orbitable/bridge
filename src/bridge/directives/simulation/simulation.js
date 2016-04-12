var angular = require('angular');
var d3      = require('d3');

angular.module('bridge.directives')
  .directive('simulation', function($window) {
    return {
      link: {
        pre: function(scope, elem) {
          var svgElem = elem.find('svg')[0];
          var translationGroup = d3.select('#translation');

          scope.svg = d3.select(svgElem);

          scope.height = svgElem.clientHeight;
          scope.width = svgElem.clientWidth;
          scope.windowCenter = [scope.width / 2, scope.height / 2];

          scope.windowXScale = d3.scale.linear()
                .range([0, scope.width]);

          scope.windowYScale = d3.scale.linear()
                .range([scope.height, 0]);

          scope.xScale = d3.scale.linear()
            .domain([-1482671117702, 1482671117702])
            .range([-scope.width, scope.width]);

          scope.yScale = d3.scale.linear()
            .domain([-1482671117702, 1482671117702])
            .range([-scope.height, scope.height]);

          scope.zoom = d3.behavior.zoom()
            .x(scope.windowXScale)
            .y(scope.windowYScale)
            .scaleExtent([0.1, 6]); // TODO: Pass scale extent as attributes

          scope.zoom.on('zoom.translation', function() {
            translationGroup.attr('transform',
              'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
          });

          scope.svg.call(scope.zoom.translate(scope.windowCenter).event);
          scope.svg.call(scope.zoom);
        }
      },
      templateUrl: 'partials/simulation-directive.html'
    };
  });
