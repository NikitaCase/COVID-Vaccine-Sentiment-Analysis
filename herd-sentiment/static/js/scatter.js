// set up chart parameters
//----------------------------------------------------------------------------------
var svg_width = 1000;
var svg_height = 640;

var margin = { top: 20, right: 20, bottom: 100, left: 100 };

var width = svg_width - margin.left - margin.right;
var height = svg_height - margin.top - margin.bottom;

var scatter = d3.select("#scatter")
    // Defining svg and chart areas 

var svg = scatter.append("svg")
    .attr("width", svg_width)
    .attr("height", svg_height)
    .classed("chart", true);

var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Axes
var chosen_x_axis = "Polarity";
var chosen_y_axis = "likes";


// Update scales for axes
//----------------------------------------------------------------------------------
function updateXscale(data, chosen_x_axis) {
    var x_scale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosen_x_axis]), d3.max(data, d => d[chosen_x_axis])])
        .range([0, width]);
    return x_scale;
};
// .domain([d3.min(data, d => d[chosen_x_axis]) * 0.95, d3.max(data, d => d[chosen_x_axis]) * 1.05])

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


var company = d3.select("#selCompanysc")



// Load CSV data
//----------------------------------------------------------------------------------
function PlotGraph(file) {

    d3.csv(file).then((company_data) => {

        // Parse varibles from csv as integers
        company_data.forEach(function(data) {
            //x variables 
            data.Polarity = +data.Polarity
            data.Subjectivity = +data.Subjectivity

            // y variables
            data.likes = +data.likes
            data.retweets = +data.retweets
        });


        // Create x and y scales
        var x_scale = updateXscale(company_data, chosen_x_axis);
        var y_scale = updateYscale(company_data, chosen_y_axis);


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
            .data(company_data)
            .enter()
            .append("circle")
            .attr("cx", d => x_scale(d[chosen_x_axis]))
            .attr("cy", d => y_scale(d[chosen_y_axis]))
            .attr("r", 4)
            .classed("stateCircle", true);

        // x axis labels
        var x_labels = chart.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)
            .attr("class", "axis_label");

        var label_Polarity = x_labels.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "Polarity")
            .text("Polarity")
            .attr("class", "active");

        var label_Subjectivity = x_labels.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "Subjectivity")
            .text("Subjectivity")
            .attr("class", "inactive");


        // y axis labels    
        var y_labels = chart.append("g")
            .attr("transform", "rotate(-90)")
            .attr("class", "axis_label");

        var label_likes = y_labels.append("text")
            .attr("y", -40) // rotated 90deg so x in plane 
            .attr("x", -(height / 2))
            .attr("dy", "1em")
            .attr("value", "likes")
            .text("Likes")
            .attr("class", "active");

        var label_retweets = y_labels.append("text")
            .attr("y", -80)
            .attr("x", -(height / 2))
            .attr("dy", "1em")
            .attr("value", "retweets")
            .text("Retweets")
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
                    x_scale = updateXscale(company_data, chosen_x_axis);
                    x_axis = renderXaxis(x_scale, x_axis);

                    // Update circles and text positions
                    circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);

                    // make selected label bold
                    if (chosen_x_axis == "Polarity") {
                        label_Polarity.classed("active", true).classed("inactive", false)
                        label_Subjectivity.classed("inactive", true)

                    } else {
                        label_Polarity.classed("inactive", true)
                        label_Subjectivity.classed("active", true).classed("inactive", false)
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
                    y_scale = updateYscale(company_data, chosen_y_axis);
                    y_axis = renderYaxis(y_scale, y_axis);

                    // update circles and text positions 
                    circles = updateCircles(circles, x_scale, chosen_x_axis, y_scale, chosen_y_axis);


                    // make selected label bold
                    if (chosen_y_axis == "likes") {
                        label_likes.classed("active", true).classed("inactive", false)
                        label_retweets.classed("inactive", true)
                    } else {
                        label_likes.classed("inactive", true)
                        label_retweets.classed("active", true).classed("inactive", false)
                    }
                }

            });
    }).catch(function(error) {
        console.log(error);
    });

};

company.on('change', function() {
    var user_company = company.property("value")
    var file
    if (user_company === 'az') { file = '/data/az.csv' } else if (user_company === 'mo') { file = '/data/mo.csv' } else { file = '/data/pf.csv' }

    PlotGraph(file)
});