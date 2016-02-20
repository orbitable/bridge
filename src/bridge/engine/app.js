/**
 * Created by Alex on 2/20/2016.
 */


var width = window.innerWidth;
var height = window.innerHeight;
var svg = d3.select("#planet").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var circles;

function render(body_data){

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
    circles = svg.selectAll("circles").data(body_data);

    // Enter
    circles.enter().append("circle")
        //.attr("fill", "orange")
        .attr("r", function(d) {return d.radius;})
        .attr("cx", function(d) {return d.position.x + 200;})
        .attr("cy", function(d) { return d.position.y + 200; });

}

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