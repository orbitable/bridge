var angular = require('angular');
var d3 = require('d3');

var BodiesDirective = function(eventPump, simulator, Scale, User) {
  return {
    scope: false,
    link: function(scope, elem) {
      // TODO: Properly resolve the initial resolution of selected body
      scope.selectedBody = {};
      scope.editingBody = {};

      // Stores the timestamp when a drag starts
      scope.dragDownTime = 0;
      // Delay in milleseconds before dragging is effective
      scope.dragThreshold = 250;
      
      // Returns whether or not the time threshold has been passed
      function checkDragThreshold() {
        return (new Date().getTime() > scope.dragDownTime + scope.dragThreshold);
      }
      var bodyGroup = d3.select(elem[0]);
      var bodies = d3.select('#bodies');

      // Set up dragging for the bodies
      var drag = d3.behavior.drag()
        .on("dragstart", function() {
          scope.dragDownTime = new Date().getTime();
        })
        .on('drag', function(d) {
          if (eventPump.paused && User.current) {
            if (checkDragThreshold()) {
              var pt = d3.mouse(bodies[0][0]);
              d3.select(this)
                .attr('cx', (pt[0]))
                .attr('cy', (pt[1]));
            }
          }
        })
        .on('dragend', function(d) {
          if (eventPump.paused && User.current) {
            if (checkDragThreshold()) {
              var pt = d3.mouse(bodies[0][0]);
              var body = {
                position: {x: Scale.x.invert(pt[0]), y: Scale.y.invert(pt[1])},
              };
              simulator.updateBody(d.id, body);
              eventPump.step(false,true);
            }
          }
        });

      function update(data) {
        
        if (typeof scope.selectedBody.copy == 'function' && !eventPump.paused) {
          scope.editingBody = scope.selectedBody.copy();
        }
           
        function isSelected(body) {
          if (body && scope.selectedBody ) {
            return body.id === scope.selectedBody.id;
          }

          return false;
        }

        function drawBodies(bodies) {
          bodies
            .attr('cx', (d) => scope.xScale(d.position.x))
            .attr('cy', (d) => scope.yScale(d.position.y))
            .attr('r',  (d) => scope.rScale(d.radius))
            .attr('fill', (d) => d.color)
            .attr('stroke', (d) => ( isSelected(d) ? 'white' : 'darkgrey' ))
            .attr('stroke-width',(d) => ( isSelected(d) ? (scope.rScale(d.radius) + 30) : 0 ))
            .call(drag)
            .on('mouseover',function() {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('stroke-width',(d) => scope.rScale(d.radius) + 30);
            })
          .on('mouseout',function() {
            d3.select(this)
              .transition()
              .duration(500)
              .attr('stroke-width',(d) => ( isSelected(d) ? (scope.rScale(d.radius) + 30) : 0 ));
            })
            .on('mousedown', function(d) {
              d3.event.stopPropagation();
              scope.selectedBody = d;
              scope.editingBody = scope.selectedBody.copy();
              simulator.selectedBody = d;
              eventPump.step(false,true);
              $('#right-sidebar').show();
              $('#note-sidebar').hide();

              lineData[d.id] = [];
            });

          }

            // This draws the note markers
            // TODO: This should only draw for admin users
            function drawAllNotes(notes) {
                notes
                    .attr('x', (d) => scope.xScale(d.position.x)-6)
                    .attr('y', (d) => scope.yScale(d.position.y)-6)
                    .attr('height',  12)
                    .attr('width',  12)
                    .attr('fill-opacity','0.0')
                    .attr('style',"stroke:grey;stroke-width:2;stroke-opacity:1.0")
                    .on('mousedown', function(d) {
                        d3.event.stopPropagation();
                        scope.selectedBody = d;
                        scope.editingBody = scope.selectedBody.copy();
                        $('#note-sidebar').show();
                        $('#right-sidebar').hide();
                    })
                    .on('mouseover',function() {
                        d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('stroke', 'white')
                        .attr('stroke-width', 3);
                    })
                    .on('mouseout',function() {
                        d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('stroke', 'grey')
                        .attr('stroke-width', 1);
                    })
                    .on('mousedown', function(d) {
                        d3.event.stopPropagation();
                        scope.selectedBody = d;
                        scope.editingBody = scope.selectedBody.copy();
                        $('#note-sidebar').show();
                        $('#right-sidebar').hide();
                    });
            }


          var bodies = bodyGroup
          .selectAll('circle')
          .data(data.bodies);

          drawBodies(bodies);
          drawBodies(bodies.enter().append('circle'));
          bodies.exit().remove();
          
         var allNotes = bodyGroup
          .selectAll('rect')
          .data(data.notes);
          
          drawAllNotes(allNotes);
          drawAllNotes(allNotes.enter().append('rect'));
          allNotes.exit().remove();
          
        }

        eventPump.register(() => update(simulator));
      }
    }
};

// List dependencies to be injected
BodiesDirective.$inject = ['eventPump', 'simulator', 'Scale', 'User'];

// Register Directive
angular.module('bridge.directives')
  .directive('bodies', BodiesDirective);
