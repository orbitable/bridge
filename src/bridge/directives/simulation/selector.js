var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('selectMarker', ['eventPump', 'simulator', 'User', function (eventPump, simulator, User) {
    return {
      link: function (scope, elem) {
        var selectorGroup = d3.select(elem[0]);

        // Stores the timestamp when a drag starts
        scope.dragDownTime = 0;
        // Delay in milleseconds before dragging is effective
        scope.dragThreshold = 250;

        // Returns whether or not the time threshold has been passed
        function checkDragThreshold() {
          return (new Date().getTime() > scope.dragDownTime + scope.dragThreshold);
        }

        function update(data) {
          // A conditional function that asserts if a body has a habitable zone
          var isSelected = (body) => body.id === scope.selectedBody.id;
          var selector = selectorGroup
            .selectAll('circle')
            .data(data.filter(isSelected));

          function drawSelector(selector) {

            var drag = d3.behavior.drag()
              .on('dragstart', function () {
                // Do nothing if not logged in
                if (!User.current) { return; }
                scope.dragDownTime = new Date().getTime();
                // Prevent drags from propagating ensuring only the vector arrow responds ot to the drag actions
                d3.event.sourceEvent.stopPropagation();
              })
              .on('drag', function () {
                // Do nothing if not logged in
                if (!User.current) { return; }

                if (eventPump.paused && User.current && simulator.isEditable()) {
                  if (checkDragThreshold()) {
                    var body = d3.select(this).data()[0];
                    var r = (Math.pow(Math.pow(d3.event.x - scope.xScale(body.position.x), 2) + 
                      Math.pow(d3.event.y - scope.yScale(body.position.y), 2), 0.5));
                    // Update position of velocity vector on drag
                    d3.select(this)
                      .attr('r', r)
                      .attr('cursor', 'drag');
                      
                    var pt = d3.mouse(this);
                    r = scope.rScale.invert(Math.pow(Math.pow(pt[0] - scope.xScale(body.position.x), 2) + 
                      Math.pow(pt[1] - scope.yScale(body.position.y), 2), 0.5) - 10);
                    console.log("r: " + r);
                    // var v = {
                    //   x: sVXi(body, pt[0]),
                    //   y: sVYi(body, pt[1]),
                    // };

                    simulator.updateBody(body.id,{radius: r});
                    //eventPump.step(false,true);
                      
                  }
                }
              })
              .on('dragend', function () {
                // Do nothing if not logged in
                if (!User.current) { return; }


                if (eventPump.paused && User.current && simulator.isEditable()) {
                  if (checkDragThreshold()) {
                    // Update the velocity of the body at the end of the drag event.
                    var pt = d3.mouse(this);
                    var body = d3.select(this).data()[0];
                    var r = scope.rScale.invert(Math.pow(Math.pow(pt[0] - scope.xScale(body.position.x), 2) + 
                      Math.pow(pt[1] - scope.yScale(body.position.y), 2), 0.5) - 10);
                    console.log("r: " + r);
                    // var v = {
                    //   x: sVXi(body, pt[0]),
                    //   y: sVYi(body, pt[1]),
                    // };

                    simulator.updateBody(body.id,{radius: r});
                  }
                }
              });

            //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
            selector
              .attr('id', "select-marker")
              .attr('cx', (d) => scope.xScale(d.position.x))
              .attr('cy', (d) => scope.yScale(d.position.y))
              .attr('r', (d) => scope.rScale(d.radius) + 10)
              .attr('fill-opacity', 0)
              .attr('stroke', 'white')
              .attr('stroke-width', (d) => scope.rScale(d.radius))
              .attr('stroke-opacity', 0.5)
              .call(drag)
              .on('mouseover', function () {
                d3.select(this)
                  .transition()
                  .style('stroke-opacity', 1.0);
              })
              .on('mouseout', function () {
                d3.select(this)
                  .transition()
                  .style('stroke-opacity', 0.5);
              });
          }

          drawSelector(selector);
          drawSelector(selector.enter().append('circle'));
          selector.exit().remove();
        }

        eventPump.register(() => update(simulator.bodies));
      }
    };
  }]);
