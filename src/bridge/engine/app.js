/**
 * Created by Alex on 2/20/2016.
 */


//var width = window.innerWidth;
//var height = window.innerHeight - 100;
var bodies = d3.select(document.getElementById("bodyGroup"));
//    .attr("width", width)
//    .attr("height", height)
//    .append("g");


// Zoom Pan
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


var  svg = d3.select(document.getElementById("svg"))
    .call(zoom);

var  bodyGrp= d3.select(document.getElementById("bodyGroup"))
    .call(zoom);

d3.select(document.getElementById("xAxis"))
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

d3.select(document.getElementById("yAxis"))
    .attr("class", "y axis")
    .call(yAxis);

function zoomed(){
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);
    bodyGrp.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}




var circles;

function render(body_data){

  //  console.log(circles);
    // Bind data
//    circles = svg.selectAll("circles").data(body_data);


/*
    // Enter
    circles.enter().append("circle")
        .attr("fill", "orange")
        .attr("r", function(d) {return d.radius;})
        .attr("cx", function(d) {return d.position.x + 200;})
        .attr("cy", function(d) { return d.position.y + 200; });

*/    // update
    circles
        .attr("fill", function(d) {
            if(d.radius <= 20){
                return "blue";
            }
           else{
                return "orange";
            }
        })
        .attr("r", function(d) {
            return d.radius;
        })
        .attr("cx", function(d) {return d.position.x + 200;
        })
        .attr("cy", function(d) { return d.position.y + 200; });

    // Exit

   circles.exit().remove();

}

function setup(body_data){

    // Bind data
    circles = bodies.selectAll("circles").data(body_data);

    // Enter
    circles.enter().append("circle")
        //.attr("fill", "orange")
        .attr("r", function(d) {return d.radius;})
        .attr("cx", function(d) {return d.position.x + 200;})
        .attr("cy", function(d) { return d.position.y + 200; });
        //.on("click", clicked());
}
/*
var coordinates = [0, 0];

function clicked()
{
    coordinates = d3.mouse(this,clicked());
    var x = coordinates[0];
    var y = coordinates[1];
    console.log(coordinates);
    add_body(10,x,y,10,10,10);

}
*/
/*
function setup2(bodies){
    // Create the planets
    this.bodies_setup = bodies;
    // Select the section we want to apply our changes to
//    var svg = d3.select("#planet").transition();


    svg.selectAll("circle")
        .data(this.bodies_setup)
        .enter()
        .append("circle")
        .attr("fill", "orange")
        .attr("r", function(d) {
            return d.radius;
        })
        .attr("cx", function(d) {

            return d.position.x + 200;
        })
        .attr("cy", function(d) {

            return d.position.y + 200;
        });

}

function update_render(bodies) {
    // Actually move the circles.
    // var svg = d3.select("#planet").transition();

    //svg.exit().remove();

    this.bodies_up = bodies;
    svg.selectAll("circle")
        .data(this.bodies_up)
        .attr("fill", "orange")
        .attr("r", function(d) {
            return d.radius;
        })
        .attr("cx", function(d) {

            return d.position.x + 200;
        })
        .attr("cy", function(d) {

            return d.position.y + 200;
        });
  //  svg.selectAll("circle").remove()
}
*/