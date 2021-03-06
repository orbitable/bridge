var angular = require('angular');

angular.module('bridge.directives')
  .directive('ruler', ['Scale', 'Units', '$filter', function(Scale, Units, $filter) {
    return {
      link: function(scope, elem) {

        var rulerGroup = d3.select(elem[0])
          .attr('id', 'rulerGroup');
        var translation = d3.select('#translation');

        var rulerBtn = d3.select('#btn_ruler');

        var rulerScale = d3.scale.linear()
          .domain([0,0])
          .range([0,0]);

        var origPos  = [0,0];
        var rulerSet = true;

        scope.svg.on('click', function(d) {
          if (rulerBtn.property('className').indexOf('on') > -1) {
            origPos = rulerSet ? d3.mouse(translation[0][0]) : origPos;
            origPos = origPos.map(p => p*scope.zoom.scale());
            rulerSet = !rulerSet;
          }
        });

        scope.svg.on('mousemove', function(d) {
          if (rulerBtn.property('className').indexOf('on') > -1) {
            if (!rulerSet) {
              var pos = d3.mouse(translation[0][0]);
              pos = pos.map(p => p*scope.zoom.scale());
              var opposite = pos[1] - origPos[1];
              var adjacent = pos[0] - origPos[0];
              var angle = Math.atan(opposite / adjacent) / Math.PI * 180 || 0;

              rulerGroup.select('g').remove();

              var x2 = Math.pow(opposite, 2);
              var y2 = Math.pow(adjacent, 2);
              var dist = Math.sqrt(x2 + y2) / scope.zoom.scale();
              opposite = opposite / scope.height;
              adjacent = adjacent / scope.height;

              var x2 = Math.pow(opposite, 2);
              var y2 = Math.pow(adjacent, 2);
              var distScaled = 1482671117702*Math.sqrt(x2 + y2)/ scope.zoom.scale();

              var domain = [distScaled, 0];
              var range = origPos[0] > pos[0] ? [-dist, 0] : [dist, 0];

              rulerScale
                .domain(domain)
                .range(range);

              rulerGroup.select('g').remove();

              var unitLabel = (d) => d == 0 ? '' : '' + $filter('number')(Units.distanceFromSim(d), 3) + ' ' + Units.labels.distance;

              var rulerAxis = d3.svg.axis()
               .scale(rulerScale)
               .ticks(2)
               .tickValues([0,distScaled])
               .tickFormat(unitLabel)
               .tickSize(25);

              var trans = d3.transform(rulerGroup.attr('transform')).translate;

              var xpos = (origPos[0] - trans[0]) / scope.zoom.scale();
              var ypos = (origPos[1] - trans[1]) / scope.zoom.scale();

              rulerGroup.append('g')
                .attr('id', 'xAxis')
                .attr('class', 'ruler')
                .attr('transform', 'translate(' + xpos + ',' + ypos + ')' +
                  ' rotate(' + angle + ')')
                .call(rulerAxis);
            }
          } else {
            rulerGroup.select('g').remove();
            rulerSet = true;
          }
        });
      }
    };
  }]);
