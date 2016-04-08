var angular = require('angular');
var d3 = require('d3');


angular.module('bridge.directives')
  .directive('vectors', ['eventPump', 'simulator', function(eventPump, simulator) {
    return {
      link: function(scope, elem) {

        var vectorGroup = d3.select(elem[0])
            .attr('id', 'vectorGroup');

        scope.zoom.on('zoom.vectors', function() {
          vectorGroup.attr('transform', 'translate(' + d3.event.translate + ')' +
                          ' scale(' + d3.event.scale + ')');
        });

        // TODO: Generalize this for all directives
        vectorGroup.call(scope.zoom.translate(scope.windowCenter).event);
        vectorGroup.call(scope.zoom.center(scope.windowCenter).event);
        vectorGroup.call(scope.zoom);




        function getVectorData(index) {

        var x1 = simulator.bodies[index].position.x / 1496000000;
        var x2 = ((simulator.bodies[index].position.x / 1496000000) + (simulator.bodies[index].velocity.x )/1000);
        var y1 = (simulator.bodies[index].position.y / 1496000000);
        var y2 = ((simulator.bodies[index].position.y / 1496000000) + (simulator.bodies[index].velocity.y )/1000);
        //arrows
//             Draw an arrow to use for lines
          vectorGroup.append("defs")
              .append("marker")
              .attr("id", "arrow")
              .attr("viewBox", "0 0 10 10")
              .attr("refX", 0)
              .attr("refY", 5)
              .attr("markerUnits", "strokeWidth")
              .style ("stroke", "red")
              .style ("fill", "red")
              .attr("markerWidth", 4)
              .attr("markerHeight", 3)
              .attr("orient", "auto")
              .append("path")
              .attr("d", "M 0 0 L 10 5 L 0 10 z");

        //  d3.select('svg').on('mousedown.zoom',null);
         // zoom.on("zoom",null);
         // selection.call(zoom);

          var dragLine = d3.behavior.drag()
              .on('dragstart', function() {
                d3.select('svg').on('mousedown.zoom',null);
                d3.select(this).attr('fill', 'red'); })
              .on('drag', function() { d3.select(this).attr('x2', d3.event.x)
                d3.select(this).attr('y2', d3.event.y); })
              .on('dragend', function() {
                selection.call(zoom);
                d3.select(this).attr('fill', 'black'); });


          vectorGroup.append('svg:line')
              .attr('class', 'draggableLine')
              .attr ("x1", x1)
              .attr ("x2", x2)
              .attr ("y1", y1)
              .attr ("y2", y2)
              .call(dragLine)
              .style ("stroke", "red")
              .attr ("stroke-width", 2)
              .attr ("marker-end", "url(\#arrow)");

          //vectorGroup.append('circle')
          //    .attr("r", 5)
          //    .attr("cx", x2)
          //    .attr("cy", y2)
          //    .on('dragstart', function() {
          //      circle.style('fill', 'red');
          //    console.log('start');})
          //    .on('drag', function() { circle.attr('cx', d3.event.x)
          //        .attr('cy', d3.event.y); })
          //    .on('dragend', function() { circle.style('fill', 'black'); });
          //
          //var drag = d3.behavior.drag()
          //    .on('dragstart', function() { circle.style('fill', 'red'); })
          //    .on('drag', function() { circle.attr('cx', d3.event.x)
          //        .attr('cy', d3.event.y); })
          //    .on('dragend', function() { circle.style('fill', 'black'); });
          //
          //var circle = vectorGroup
          //    .append('svg:circle')
          //    .attr('class', 'draggableCircle')
          //    .attr('cx', x2)
          //    .attr('cy', y2)
          //    .attr('r', 5)
          //    .call(drag)
          //    .style('fill', 'black');


        }



      //  eventPump.register(() => update(lineData));
        eventPump.register(function() {
          simulator.bodies.forEach(function(body){
            if (eventPump.paused) {
              getVectorData(simulator.bodies.indexOf(body));
            }
            else{
              vectorGroup.selectAll("*").remove();
            }
            });

         // getVectorData(2);

        });
      }
    };
  }]);
