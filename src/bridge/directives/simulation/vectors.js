var angular = require('angular');
var d3 = require('d3');

var VectorArrowDirective = function(eventPump, simulator, User) {
  return {
    link: function(scope, elem) {
      var activeColor   = 'lightgray';
      var inactiveColor = 'gray';

      var vectorGroup = d3.select(elem[0])
        .attr('id', 'vectorGroup');

      // Draw a arrow to use as a end marker for vector arrows
      vectorGroup.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 0)
        .attr('refY', 5)
        .attr('markerUnits', 'strokeWidth')
        .style('stroke', inactiveColor)
        .style('fill', inactiveColor)
        .attr('markerWidth', 1)
        .attr('markerHeight', 1)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z');

      function drawVector(vector) {
        // Scale factors
        var vF = 1000;

        var sR = (b) => scope.rScale(b.radius);

        // Scaling functions for position
        var sPX = (b) => scope.xScale(b.position.x);
        var sPY = (b) => scope.yScale(b.position.y);

        // Scaling functions for velocity
        var sVX  = (b) => scope.xScale(b.position.x) + (b.velocity.x / vF);
        var sVXi = (b, x) => (x - scope.xScale(b.position.x)) * vF;

        var sVY  = (b) => scope.yScale(b.position.y) + (b.velocity.y / vF);
        var sVYi = (b, y) => (y - scope.xScale(b.position.y)) * vF;

        var drag = d3.behavior.drag()
          .on('dragstart', function() {
            // Do nothing if not logged in
            if (!User.current) { return; }

            // Prevent drags from propagating ensuring only the vector arrow
            // responds ot to the drag actions
            d3.event.sourceEvent.stopPropagation();
          })
          .on('drag', function() {
            // Do nothing if not logged in
            if (!User.current) { return; }

            // Update position of velocity vector on drag
            d3.select(this)
              .attr('x2', d3.event.x)
              .attr('y2', d3.event.y);
          })
          .on('dragend', function() {
            // Do nothing if not logged in
            if (!User.current) { return; }

            // Update the velocity of the body at the end of the drag event.
            var pt = d3.mouse(this);
            var body = d3.select(this).data()[0];
            var v = {
              x: sVXi(body, pt[0]),
              y: sVYi(body, pt[1]),
            };

            body.update({velocity: v});
          });

        vector
          .style('stroke', inactiveColor)
          .attr('stroke-width', (d) => sR(d) * 1.1)
          .attr('marker-end', 'url(\#arrow)')
          .attr('x1', sPX)
          .attr('y1', sPY)
          .attr('x2', sVX)
          .attr('y2', sVY)
          .call(drag)
          .on('mouseover', function() {
            // Do nothing if not logged in
            if (!User.current) { return; }

            d3.select(this)
              .transition()
              .style('stroke', activeColor);
          })
          .on('mouseout', function() {
            // Do nothing if not logged in
            if (!User.current) { return; }

            d3.select(this)
              .transition()
              .style('stroke', inactiveColor);
          });
      }

      function update(data) {
        data = eventPump.paused ? data : [];
        var vectors = vectorGroup
          .selectAll('line')
          .data(data);

        drawVector(vectors);
        drawVector(vectors.enter().append('line'));
        vectors.exit().remove();
      }

      eventPump.register(() => update(simulator.bodies));
    }
  };
};

VectorArrowDirective.$inject = ['eventPump', 'simulator', 'User'];

angular.module('bridge.directives')
  .directive('vectors', VectorArrowDirective);
