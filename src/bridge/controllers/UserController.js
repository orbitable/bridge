angular.module('bridge.controllers')
  .controller('userController', ['$scope', 'eventPump', function($scope, eventPump) {

      /* DEMO */
      $scope.user = true;
      $scope.name = "Donald Knuth"

        width = document.getElementById("svg").offsetWidth;
        height =  document.getElementById("svg").offsetHeight;

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
          .on("zoom", zoomed);

        var  svg = d3.select("#svg")
            .call(zoom);

        var  bodyGrp= d3.select("#bodyGroup")
           .call(zoom);

       d3.select("#xAxis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

       d3.select("#yAxis")
        .attr("class", "y axis")
        .call(yAxis);

      function zoomed(){
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        bodyGrp.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }

      this.play = function() {
        eventPump.resume();
      };

      this.pause = function() {
        eventPump.pause();
      };

      this.paused = function() {
        return eventPump.paused;
      };

      this.refresh = function() {
        console.log("refresh");
      };

      this.logout = function(){
        $scope.user = false;
      }
  }]);
