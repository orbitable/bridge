var angular = require('angular');
var d3 = require('d3');

angular.module('bridge.directives')
  .directive('bodies', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      selectedBody: '=',
      link: function(scope, elem) {

        var bodyGroup = d3.select(elem[0]);

        function update(data) {
          
        function drawBodies(bodies) {
            bodies
            .attr('cx', (d) => scope.xScale(d.position.x))
            .attr('cy', (d) => scope.yScale(d.position.y))
            .attr('r',  (d) => (Math.log((d.radius + 14961) / 14960)) / Math.LN10)
            .attr('fill', (d) => d.color)
            .on('mousedown', function(d) {
              d3.event.stopPropagation();
              scope.selectedBody = d;
              $('#right-sidebar').show();
            })
            .on('mouseover',function() {
              d3.select(this)
              .transition()
              .duration(500)
              .attr('stroke', 'white')
              .attr('stroke-width',(d) => ((Math.log((d.radius + 14961) / 14960)) / Math.LN10) + 30);
            })
            .on('mouseout',function() {
              d3.select(this)
              .transition()
              .duration(500)
              .attr('stroke-width',0);
            })
            .on('mousedown', function(d) {
              d3.event.stopPropagation();
              scope.selectedBody = d;
              $('#right-sidebar').show();

              lineData[d.id] = [];
            });

          }

            // This draws the note markers
            // TODO: This should only draw for admin users
            function drawAllNotes(notes) {
                notes
                    .attr('x', (d) => scope.xScale(d.position.x)-16)
                    .attr('y', (d) => scope.yScale(d.position.y)-10)
                    .attr('height',  12)
                    .attr('width',  12)
                    .attr('style',"stroke:grey;stroke-width:2;fill-opacity:0.0;stroke-opacity:1.0")
                    .on('mousedown', function(d) {
                        d3.event.stopPropagation();
                        scope.selectedBody = d;
                        $('#right-sidebar').show();
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
                        $('#right-sidebar').show();
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
    };
  }]);
