
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
// var chosen_x_axis = "poverty";
// var chosen_y_axis = "healthcare";
var chosen_x_axis = "polarity";
var chosen_y_axis = "likes";


// Update scales for axes
//----------------------------------------------------------------------------------
function updateXscale(data, chosen_x_axis) {
    var x_scale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosen_x_axis]) * 0.95, d3.max(data, d => d[chosen_x_axis]) * 1.05])
        .range([0, width]);
    return x_scale;
};

function updateYscale(data, chosen_y_axis) {
    var y_scale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosen_y_axis]) * 0.85, d3.max(data, d => d[chosen_y_axis]) * 1.05])
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

function updateCircleText(circle_text, new_x_scale, chosen_x_axis, new_y_scale, chosen_y_axis) {
    circle_text.transition()
        .duration(1000)
        .attr("x", d => new_x_scale(d[chosen_x_axis]))
        .attr("y", d => new_y_scale(d[chosen_y_axis]));

    return circle_text;
};

// Update Tooltip based on chosen axes
//----------------------------------------------------------------------------------
function updateToolTip(chosen_x_axis, chosen_y_axis, chart, circles) {
    var x, y

    if (chosen_x_axis == "poverty") { x = "Poverty (%): " } else if (chosen_x_axis == "age") { x = "Median Age: " } else { x = "Income: "; };
    if (chosen_y_axis == "healthcare") { y = "Healthcare (%): " } else if (chosen_y_axis == "smokes") { y = "Smokes (%): " } else { y = "Obesity (%): " };

    var tooltip = d3.tip().attr("class", "d3-tip").html(function(d) {
        return `<div> ${d.state} <br>
                ${x} ${d[chosen_x_axis]} <br>
                ${y} ${d[chosen_y_axis]} </div>`;
    });

    // Add the tooltips to the chart group
    chart.call(tooltip)

    // Add listener for mouseover and mouseout
    circles.on("mouseover", function(d) { tooltip.show(d, this); })
        .on("mouseout", function(d) { tooltip.hide(d, this) });
    return circles
};

// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,
// healthcareLow,healthcareHigh,obesity,
// obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228

// Load CSV data
//----------------------------------------------------------------------------------
d3.csv('D3_data_journalism/assets/data/data.csv').then((census_data) => {

    // Parse varibles from csv as integers
    census_data.forEach(function(data) {
        //x variables 
        data.age = +data.age
        data.poverty = +data.poverty
        data.income = +data.income

        // y variables
        data.healthcare = +data.healthcare
        data.smokes = +data.smokes
        data.obesity = +data.obesity
    });


    // Create x and y scales
    var x_scale = updateXscale(census_data, chosen_x_axis);
    var y_scale = updateYscale(census_data, chosen_y_axis);


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
        .data(census_data)
        .enter()
        .append("circle")
        .attr("cx", d => x_scale(d[chosen_x_axis]))
        .attr("cy", d => y_scale(d[chosen_y_axis]))
        .attr("r", 12)
        .classed("stateCircle", true);

    // Append Circle Text
    var circle_text = chart.selectAll()
        .data(census_data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => x_scale(d[chosen_x_axis]))
        .attr("y", d => y_scale(d[chosen_y_axis]))
        .attr("font-size", 10)
        .attr("alignment-baseline", "central")
        .classed("stateText", true);


    // Append tooltips
    var circles, circle_text = updateToolTip(chosen_x_axis, chosen_y_axis, circles, circle_text);


    // x axis labels
    var x_labels = chart.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("class", "axis_label");

    var label_poverty = x_labels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)")
        .attr("class", "active");

    var label_age = x_labels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Median)")
        .attr("class", "inactive");

    var label_income = x_labels.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Median)")
        .attr("class", "inactive");


    // y axis labels    
    var y_labels = chart.append("g")
        .attr("transform", "rotate(-90)")
        .attr("class", "axis_label");

    var label_healthcare = y_labels.append("text")
        .attr("y", -40) // rotated 90deg so x in plane 
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)")
        .attr("class", "active");

    var label_smokes = y_labels.append("text")
        .attr("y", -60)
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .text("Smokes (%)")
        .attr("class", "inactive");

    var label_obesity = y_labels.append("text")
        .attr("y", -80)
        .attr("x", -(height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .text("Obese (%)")
        .attr("class", "inactive");


    // Event listener for click on x axis label
    x_labels.selectAll("text")
        .on("click", function() {

            // Reassign x parameter
            var value = d3.select(this).attr("value");
            if (value !== chosen_x_axis) {
                chosen_x_axis = value;
                // console.log(chosen_x_axis)

                // Update x scale and axis
                x_scale = updateXscale(census_data, chosen_x_axis);
                x_axis = renderXaxis(x_scale, x_axis);

                // Update circles and text positions
                circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);
                circle_text = updateCircleText(circle_text, x_scale, chosen_x_axis, y_scale, chosen_y_axis);

                // Update tooltips
                circles, circle_text = updateToolTip(chosen_x_axis, chosen_y_axis, circles, circle_text);

                // make selected label bold
                if (chosen_x_axis == "poverty") {
                    label_poverty.classed("active", true).classed("inactive", false)
                    label_age.classed("inactive", true)
                    label_income.classed("inactive", true)

                } else if (chosen_x_axis == "age") {
                    label_poverty.classed("inactive", true)
                    label_age.classed("active", true).classed("inactive", false)
                    label_income.classed("inactive", true)
                } else {
                    label_poverty.classed("inactive", true)
                    label_age.classed("inactive", true)
                    label_income.classed("active", true).classed("inactive", false)
                };
            }
        });


    // Event listener for click on y axis label 
    y_labels.selectAll("text")
        .on("click", function() {

            // Reassign y parameter
            var value = d3.select(this).attr("value");
            if (value !== chosen_y_axis) {
                chosen_y_axis = value;

                // Update y scale and axis
                y_scale = updateYscale(census_data, chosen_y_axis);
                y_axis = renderYaxis(y_scale, y_axis);

                // update circles and text positions 
                circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);
                circle_text = updateCircleText(circle_text, x_scale, chosen_x_axis, y_scale, chosen_y_axis);

                // Update tooltips
                circles, circle_text = updateToolTip(chosen_x_axis, chosen_y_axis, circles, circle_text);

                // make selected label bold
                if (chosen_y_axis == "healthcare") {
                    label_healthcare.classed("active", true).classed("inactive", false)
                    label_smokes.classed("inactive", true)
                    label_obesity.classed("inactive", true)
                } else if (chosen_y_axis == "smokes") {
                    label_healthcare.classed("inactive", true)
                    label_smokes.classed("active", true).classed("inactive", false)
                    label_obesity.classed("inactive", true)
                } else {
                    label_healthcare.classed("inactive", true)
                    label_smokes.classed("inactive", true)
                    label_obesity.classed("active", true).classed("inactive", false)
                }
            }

        });
}).catch(function(error) {
    console.log(error);
});