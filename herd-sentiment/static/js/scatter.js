// set up chart parameters
//----------------------------------------------------------------------------------
var svg_width = 1000;
var svg_height = 640;

var margin = { top: 20, right: 20, bottom: 100, left: 100 };

var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;

// Defining svg and chart areas 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .classed("chart", true);

var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Axes
var chosen_y_axis = "Moderna";
var chosen_x_axis = "Polarity"

// Update scales for axes
//----------------------------------------------------------------------------------
function updateXscale(data, chosen_x_axis) {
    var x_scale = d3.scaleLinear()
        .domain([-1.05, 1.05])
        .range([0, width]);
    return x_scale;
};

function updateYscale(data, chosen_y_axis) {
    var y_scale = d3.scaleLinear()
        .domain([-0.01, d3.max(data, d => d[chosen_y_axis]) * 1.05])
        .range([height, 0]);
    return y_scale;
};

// Update Axes 
//----------------------------------------------------------------------------------
function renderXaxis(new_x_scale, x_axis) {
    var bottom_axis = d3.axisBottom(new_x_scale);
    x_axis.transition()
        .duration(1000)
        .call(bottom_axis);
    return x_axis;
};

function renderYaxis(new_y_scale, y_axis) {
    var left_axis = d3.axisLeft(new_y_scale);
    y_axis.transition()
        .duration(800)
        .call(left_axis);
    return y_axis;
};

// Render new circles and circle text 
//----------------------------------------------------------------------------------
function updateCircles(circles, new_x_scale, chosen_x_axis, new_y_scale, chosen_y_axis) {
    circles.transition()
        .duration(1000)
        .attr("cx", d => new_x_scale(d[chosen_x_axis]))
        .attr("cy", d => new_y_scale(d[chosen_y_axis]));
    return circles;
};


// Load CSV data
//----------------------------------------------------------------------------------
d3.csv('/data/polarity.csv').then((polarity_data) => {

    // Parse varibles from csv as integers
    polarity_data.forEach(function(data) {
        //x variables 
        data.Polarity = +data.Polarity


        // y variables
        data.Moderna = +data.Moderna
        data.Pfizer = +data.Pfizer
        data.AstraZeneca = +data.AstraZeneca
    });


    // Create x and y scales
    var x_scale = updateXscale(polarity_data, chosen_x_axis);
    var y_scale = updateYscale(polarity_data, chosen_y_axis);


    // Create new axes
    var bottom_axis = d3.axisBottom(x_scale);
    var left_axis = d3.axisLeft(y_scale);


    // Append the new axes
    var x_axis = chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottom_axis);

    var y_axis = chart.append("g")
        .call(left_axis);


    // Append Circles
    var circles = chart.selectAll()
        .data(polarity_data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d[chosen_x_axis]))
        .attr("cy", d => y_scale(d[chosen_y_axis]))
        .attr("r", 12)
        .classed("stateCircle", true);

    // Append Circle Text
    var circle_text = chart.selectAll()
        .data(polarity_data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => x_scale(d[chosen_x_axis]))
        .attr("y", d => y_scale(d[chosen_y_axis]))
        .attr("font-size", 10)
        .attr("alignment-baseline", "central")
        .classed("stateText", true);

    // x axis labels
    var x_labels = chart.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("class", "axis_label");

    var label_Polarity = x_labels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "Polarity")
        .text("Polarity (Rounded to 1 decimal place)")
        .attr("class", "inactive");

    // y axis labels    
    var y_labels = chart.append("g")
        .attr("transform", "rotate(-90)")
        .attr("class", "axis_label");

    var label_Moderna = y_labels.append("text")
        .attr("y", -40) // rotated 90deg so x in plane 
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .attr("value", "Moderna")
        .text("Moderna (%)")
        .attr("class", "active");

    var label_Pfizer = y_labels.append("text")
        .attr("y", -60)
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .attr("value", "Pfizer")
        .text("Pfizer-BioNTech(%)")
        .attr("class", "inactive");

    var label_AstraZeneca = y_labels.append("text")
        .attr("y", -80)
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .attr("value", "AstraZeneca")
        .text("AstraZeneca (%)")
        .attr("class", "inactive");

    // Event listener for click on y axis label 
    y_labels.selectAll("text")
        .on("click", function() {

            // Reassign y parameter
            var value = d3.select(this).attr("value");
            if (value !== chosen_y_axis) {
                chosen_y_axis = value;

                // Update y scale and axis
                y_scale = updateYscale(polarity_data, chosen_y_axis);
                y_axis = renderYaxis(y_scale, y_axis);

                // update circles and text positions 
                circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);

                // make selected label bold
                if (chosen_y_axis == "Moderna") {
                    label_Moderna.classed("active", true).classed("inactive", false)
                    label_Pfizer.classed("inactive", true)
                    label_AstraZeneca.classed("inactive", true)
                } else if (chosen_y_axis == "Pfizer") {
                    label_Moderna.classed("inactive", true)
                    label_Pfizer.classed("active", true).classed("inactive", false)
                    label_AstraZeneca.classed("inactive", true)
                } else {
                    label_Moderna.classed("inactive", true)
                    label_Pfizer.classed("inactive", true)
                    label_AstraZeneca.classed("active", true).classed("inactive", false)
                }
            }

        });
}).catch(function(error) {
    console.log(error);
});