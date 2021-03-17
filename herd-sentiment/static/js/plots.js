// Select page sections 
var pop_chart = d3.select('#p-popular')
var time_chart = d3.select('#p-time')
var blob_chart = d3.select('#word-cloud')


// Load inital functions
function init() {
    // calls inital functions
}


function LoadPopularity() {
    var url = '/popularity'
    d3.json(url).then((data) => {

        var likes = data.popularity[0]['likes']
        var retweets = data.popularity[0]['retweets']
        var sentiment = data.popularity[0]['sentiment']


        var trace_likes = {
            x: sentiment,
            y: likes,
            name: 'Likes',
            type: 'bar'
        }

        // var trace_likes = {
        //     x: sentiment,
        //     y: data.popularity[0]['likes'],
        //     name: 'Likes',
        //     type: 'bar'
        // };

        // var trace_retweets = {
        //     x: sentiment,
        //     y: data.popularity[0]['retweets'],
        //     name: 'Retweets',
        //     type: 'bar'
        // };

        var data = [trace_likes];

        var trace_retweets = {
            x: sentiment,
            y: retweets,
            name: 'Retweets',
            type: 'bar'
        };

        var data2 = [trace_retweets]

        var data3 = [trace_likes, trace_retweets];

        var layout = { barmode: 'group' };

        Plotly.newPlot('p-popular', data);

        Plotly.newPlot('p-popular2', data2)

        Plotly.newPlot('p-popular3', data3, layout);

    })
}


LoadPopularity()

//var chart = d3.select('#chartly')
//var chart = document.getElementById('chartly').getContext('2d')

// function Chartly() {
//     var url = '/popularity'
//     d3.json(url).then((data) => {

//         var bar_chart = new Chartly(chart, {
//             type: 'bar',
//             data: {
//                 labels: data.popularity[0]['sentiment'],
//                 datasets: [{
//                     label: 'likes',
//                     data: data.popularity[0]['likes']
//                 }]

//             },
//             options: {

//             }
//         });

//     })
// }


// Chartly()