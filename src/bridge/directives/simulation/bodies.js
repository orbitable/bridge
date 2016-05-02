var angular = require('angular');
var d3 = require('d3');

var BodiesDirective = function(eventPump, simulator, Scale, User) {
  return {
    scope: false,
    link: function(scope, elem) {
      // TODO: Properly resolve the initial resolution of selected body
      scope.selectedBody = {};
      scope.selectedNote = {};

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
                .attr('cy', (pt[1]))
                .attr('x', (pt[0]) - 6)
                .attr('y', (pt[1]) - 6);
            }
          }
        })
        .on('dragend', function(d) {
          if (eventPump.paused && User.current) {
            if (checkDragThreshold()) {
              var pt = d3.mouse(bodies[0][0]);
              var item = {
                position: {x: Scale.x.invert(pt[0]), y: Scale.y.invert(pt[1])},
              };
              // TODO: Is there a more elegant way of checking if 'd' is a body or a note?
              if (typeof d.mass !== "undefined") {
                simulator.updateBody(d.id, item);
              }
              else {
                simulator.updateNote(d.id, item);
              }
              eventPump.step(false,true);
            }
          }
        });

      function update(data) {
<<<<<<< HEAD

=======
>>>>>>> master
        if (typeof scope.selectedBody.copy == 'function' && !eventPump.paused) {

          if (scope.selectedBody.position) {
            document.getElementById('positionx').value = scope.selectedBody.position.x;
            document.getElementById('positiony').value = scope.selectedBody.position.y;
          }

          if (scope.selectedBody.velocity) {
            document.getElementById('velocityx').value = scope.selectedBody.velocity.x;
            document.getElementById('velocityy').value = scope.selectedBody.velocity.y;
          }
        }

        function isSelectedBody(body) {
          if (body && scope.selectedBody ) {
            return body.id === scope.selectedBody.id;
          }
          return false;
        }

        function isSelectedNote(note) {
          if (note && scope.selectedNote ) {
            return note.id === scope.selectedNote.id;
          }
          return false;
        }

        function drawBodies(bodies) {
          bodies
            .attr('cx', (d) => scope.xScale(d.position.x))
            .attr('cy', (d) => scope.yScale(d.position.y))
            .attr('r',  (d) => scope.rScale(d.radius))
            .attr('fill', (d) => d.color)
            .attr('hideHabitable', (d) => (d.hideHabitable ? d.hideHabitable : false))  // add false if undef
            // .attr('stroke', (d) => ( isSelectedBody(d) ? 'white' : 'darkgrey' ))
            // .attr('stroke-width',(d) => ( isSelectedBody(d) ? (scope.rScale(d.radius) + 30) : 0 ))
            .call(drag)
            .on('mouseover',function() {
              d3.select(this)
                .transition()
                .duration(500)
                .attr('r',(d) => scope.rScale(d.radius) + 10);
            })
          .on('mouseout',function() {
            d3.select(this)
              .transition()
              .duration(500)
              .attr('r',(d) =>  scope.rScale(d.radius) );
            })
            .on('mousedown', function(d) {
              d3.event.stopPropagation();
              scope.selectedBody = d;
              simulator.selectedBody = d;
              scope.selectedNote = {};
              eventPump.step(false,true);

              scope.$apply();

              if (!scope.trackerPanel.isOpen) {
                $('#body-sidebar').show();
                $('#note-sidebar').hide();
              }

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
                    .attr('stroke','white')
                    .attr('stroke-width', (d) => ( isSelectedNote(d) ? 3.0 : 1.0 ))
                    .attr('stroke-opacity',(d) => ( isSelectedNote(d) ? 1.0 : 0.5 ))
                    .call(drag)
                    .on('mousedown', function(d) {
                        d3.event.stopPropagation();

                        scope.selectedBody = {};
                        scope.selectedNote = d;
                        eventPump.step(false,true);

                        scope.$apply();

                        $('#note-sidebar').show();
                        $('#body-sidebar').hide();
                        $('#tracker-sidebar').hide();
                    })
                    .on('mouseover',function() {
                        d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('stroke-width', 3.0)
                        .attr('stroke-opacity', 1.0);
                    })
                    .on('mouseout',function() {
                        d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('stroke-width', (d) => ( isSelectedNote(d) ? 3.0 : 1.0 ))
                        .attr('stroke-opacity', (d) => ( isSelectedNote(d) ? 1.0 : 0.5 ));
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
