
var angular = require('angular');

angular.module('bridge.directives')
  .directive('bodies', ['$interval', 'eventPump', 'simulator', function($interval, eventPump, simulation) {
    return {
      link: function(scope, elem, attr) {
        var svg = d3.select(elem[0])
          .append('svg')
          .attr('id', 'svg');

        var svgGroup = svg.append('g').attr('id', 'svgGroup');

        var axisGroup = svgGroup.append('g').attr('id', 'axisGroup');

        var bodyGroup = svgGroup.append('g').attr('id', 'bodyGroup');

        // TODO: Get dimensions from element
        var width  = document.getElementById('svg').offsetWidth;
        var height = document.getElementById('svg').offsetHeight;

        var x = d3.scale.linear()
          .domain([-width / 2, width / 2])
          .range([0, width]);

        var y = d3.scale.linear()
          .domain([-height / 2, height / 2])
          .range([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .ticks(width/70)
          .orient("bottom")
          .tickSize(-height);

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(height/70)
          .tickSize(-width);

        var zoom = d3.behavior.zoom()
          .x(x)
          .y(y)
          .scaleExtent([0.1, 2])
          .on("zoom", function() {
            svg.select(".x.axis") .call(xAxis);
            svg.select(".y.axis").call(yAxis);
            bodyGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
          });

        svg.call(zoom);
        bodyGroup.call(zoom);

        axisGroup.append('g')
          .attr('id', 'xAxis')
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        axisGroup.append('g')
          .attr('id', 'yAxis')
          .attr("class", "y axis")
          .call(yAxis);

        eventPump.register(function() {
          bodyGroup.selectAll('*').remove();

          var circle = bodyGroup.selectAll('circle').data(simulation.bodies);
          var circleEnter = circle.enter()
            .append("circle")
            .attr('cx', function(d) {
              return d === null ? 0 : d.position.x;
            })
            .attr('cy', function(d) {
              return d === null ? 0 : d.position.y;
            })
            .attr('r', function(d) {
              return d === null ? 0 : d.radius;
            })
            .attr('fill', function(d) {

              if (d!==null &&d.luminosity >=0 && d.radius >0) {
                calcHabitableZone(d);
              }
              return getColor(d);
            });

            function getColor(d)
            {
               //Constant from Stefan-Boltzmann Law
               sigma = 5.6704* Math.pow(10,-8)
               //Uncomment the below line to test the changing of star colors based on luminostiy and radius
               //d.luminosity = 1
               
               if (d!==null&&d.luminosity>=0  ) {
                    //convert solar units to watts for temp calculation
                    lum =d.luminosity *3.827*Math.pow(10,26);
                    //this assumes that the radius is stored as the #.## term of #.## *10^8 meters, may need to change later
                    rad = d.radius
                    temp = Math.pow((lum/(4 *Math.PI* Math.pow(rad,2)*sigma)),.25)

                    if (temp>=28000) {
                      color = "#1a1aff";
                    }
                    else if (temp>=10000) {
                     color="#80d4ff"
                    }
                    else if (temp>=7500) {
                      color="#ffffff"
                    }
                    else if (temp>=6000) {
                      color="#ffff80"
                    }
                    else if (temp>=4900) {
                      color="#ffff1a"
                    }
                    else if (temp>=3500) {
                      color = "#ff6600"
                    }
                    else{
                      color ="#ff0000"
                    }
                  }
                  else{
                    color="green"
                  }
                  return color;
            }
            function calcHabitableZone(body)
            {
              //conversion factor for au to M
              auKMConver = 1.496*Math.pow(10,11);
              
              
              //calculate the inner and outer radius
              innerRadius = Math.pow(body.luminosity/1.1,.5)*auKMConver;
              outerRadius = Math.pow(body.luminosity/0.53,.5)*auKMConver;
              innerRadius = innerRadius/ 1496000000;
              outerRadius = outerRadius/1496000000;
              
                //draw habitable zone around star (divide radius by the scale of the radius (for now its assumed to be 10^8))
                bodyGroup.append("circle")
                 .attr("cx",body.position.x)
                 .attr("cy",body.position.y)
                 .attr("r",((outerRadius-innerRadius)/2+innerRadius))
                 .attr("fill-opacity",0)
                 .attr("stroke","green")
                 .attr("stroke-width",(outerRadius-innerRadius))
                 .attr("stroke-opacity",.25)
             }
        });
      }
    };
  }]);
