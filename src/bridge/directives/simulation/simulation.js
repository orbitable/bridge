var angular = require('angular');
var d3      = require('d3');

angular.module('bridge.directives')
  .directive('simulation', function($window) {
    return {
      link: {
        pre: function(scope, elem) {
          var svgElem = elem.find('svg')[0];

          scope.svg = d3.select(svgElem);

          scope.height = svgElem.clientHeight;
          scope.width = svgElem.clientWidth;
          scope.windowCenter = [scope.width / 2, scope.height / 2];

          scope.xScale = d3.scale.linear()
            .domain([-1482671117702, 1482671117702])
            .range([-scope.width, scope.width]);

          scope.yScale = d3.scale.linear()
            .domain([-1482671117702, 1482671117702])
            .range([-scope.height, scope.height]);

          scope.zoom = d3.behavior.zoom()
            // .x(scope.xScale)
            // .y(scope.yScale)
            .scaleExtent([0.1, 6]); // TODO: Pass scale extent as attributes

          scope.svg.call(scope.zoom);
        }
      },
      // TODO: Use html template
      template: '<svg  id="svg" class="simulation">' +
         '<g axis></g>' +
         '<g habitable-zones></g>' +
         '<g paths></g>' +
         '<g vectors></g>' +
         '<g bodies></g>' +
         '<g ruler></g>' +
       '</svg>',
    };
  });
