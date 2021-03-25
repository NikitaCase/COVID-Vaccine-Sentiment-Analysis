// Select areas of the page which will be used to sort and display data
var button_filter = d3.select("#filter-btn");
var button_clear = d3.select("#clear-btn");
var form = d3.select("form");
var company = d3.select("#selComp")
var sentiment = d3.select("#selSent")

company.on('change', FilterTweets);

sentiment.on('change', FilterTweets);



// creating a function to filter the data
function FilterTweets() {

    // Prevent the page from refreshing 
    d3.event.preventDefault();

    //Store the user input to variables
    var user_company = company.node().value
    var user_sentiment = sentiment.node().value


    d3.json('/sample').then((data) => {

        // Initialise the variable to bne sorted by adding all the data inhereted from the data.js file
        var selected = data
        console.log(selected)

        // Filter data by user input
        selected = selected.filter(row => row.manufacturer == user_company)
        console.log(selected)
        selected = selected.filter(row => row.sentiment == user_sentiment)
        console.log(selected)

        // Clear what was previously displayed in table
        var tbody = d3.select("tbody");
        tbody.html("");

        // Iterate through selected data
        // add a new row for each sighting
        selected.forEach((row) => {
            var tr = tbody.append("tr");

            // Iterate through key-value pairs pair, add new column for each pair 
            // display the value in the column 

            Object.entries(row).forEach(([key, value]) => {
                var td = tr.append("td")
                td.text(value)
            })
        })
    })
};


// Clear table output 
function clear_table() {
    var tbody = d3.select("tbody");
    tbody.html("");
};


// Add listeners 
button_filter.on("click", FilterTweets);
form.on("change", FilterTweets);

button_clear.on("click", clear_table);