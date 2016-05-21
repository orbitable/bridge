var angular = require('angular');
var d3      = require('d3');

angular.module('bridge.directives')
  .directive('simulation', ['Scale', '$window', function(Scale, $window) {
    return {
      link: {
        pre: function(scope, elem) {
          var svgElem = elem.find('svg')[0];
          var translationGroup = d3.select('#translation');

          var dragUpdate = d3.behavior.drag()
            .on('drag', () => scope.$apply());
          
          scope.svg = d3.select(svgElem);

          scope.svg.call(dragUpdate);

          scope.height = svgElem.clientHeight;
          scope.width = svgElem.clientWidth;
          scope.scaleMin = Math.min(scope.height,scope.width);
          Scale.setBoundingRect(scope.scaleMin,scope.scaleMin);

          scope.windowCenter = [scope.width / 2, scope.height / 2];

          scope.windowXScale = d3.scale.linear()
                .range([0, scope.width]);

          scope.windowYScale = d3.scale.linear()
                .range([scope.height, 0]);

          scope.xScale = Scale.x;
          scope.yScale = Scale.y;

          scope.xTransform = function(x) {
            return scope.xScale(x) * scope.zoom.scale() + scope.zoom.translate()[0];
          };

          scope.yTransform = function(y) {
            return scope.yScale(y) * scope.zoom.scale() + scope.zoom.translate()[1];
          };

          scope.rScale = function(r) {
            return Math.max((Math.log((r + 14961) / 14960)) / Math.LN10, scope.xScale(r));
          };

          scope.zoom = d3.behavior.zoom()
            .x(scope.windowXScale)
            .y(scope.windowYScale)
            .scaleExtent([0.1, 6]); // TODO: Pass scale extent as attributes

          scope.zoom.on('zoom.translation', function() {
            translationGroup.attr('transform',
              'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
          });
         
          Scale.snapToBody = function(body) {
            var translate = [
              -(scope.xScale(body.position.x) * scope.zoom.scale() - scope.width/2),
              -(scope.yScale(body.position.y) * scope.zoom.scale() - scope.height/2)
              ];
            translationGroup.attr('transform',
              'translate(' + translate + ') scale(' + scope.zoom.scale() + ')'
            );   
            scope.zoom.translate(translate);
          };

          scope.svg.call(scope.zoom.translate(scope.windowCenter).event);
          scope.svg.call(scope.zoom);

        }
      },
      templateUrl: 'partials/simulation-directive.html'
    };
  }]);
