// Select page sections

var company_select = d3.select("#selCompanybg")

PlotBars();

function PlotBars(){
  d3.json('/popularity').then((data) => {

    // Separate data by vaccine manufacturer
    var mo = data.popularity[0]
    var az = data.popularity[1]
    var pf = data.popularity[2]
    
    // For responsivenes 
    var config = {responsive: true}

    // Plot Retweets
    // -----------------------------------------------
    var trace_mo_r = {
      x: mo.sentiment,
      y: mo.retweets,
      name: mo.name,
      type: 'bar',
      marker:{ 
      color:'#ff6f91'}
    };

    var trace_az_r = {
      x: az.sentiment,
      y: az.retweets,
      name: az.name,
      type: 'bar', 
      marker:{
      color: '#ff9671'}
    };

    var trace_pf_r = {
      x: pf.sentiment,
      y: pf.retweets,
      name: pf.name,
      type: 'bar', 
      marker:{
      color: '#ffc75f'}
    };
     
    
    var data1 = [trace_mo_r, trace_az_r, trace_pf_r];
    
    var layout1 = {
      barmode: 'group',
      title:{text:'Number of Retweets By Sentiment'}
    };
    
    Plotly.newPlot('plot-retweets', data1, layout1, config);


    // Plot Likes
    // -----------------------------------------------
    var trace_mo_l = {
      x: mo.sentiment,
      y: mo.likes,
      name: mo.name,
      type: 'bar', 
      marker: {color:'#4ffbdf'}
    };

    var trace_az_l = {
      x: az.sentiment,
      y: az.likes,
      name: az.name,
      type: 'bar',
      marker:{
      color: '#00c2a8'}
    };

    var trace_pf_l = {
      x: pf.sentiment,
      y: pf.likes,
      name: pf.name,
      type: 'bar', 
      marker:{
      color: '#008b74'}
    };
     
    
    var data = [trace_mo_l, trace_az_l, trace_pf_l];
    
    var layout = {
      barmode: 'group',
      title:{text:'Number of likes By Sentiment'}
    };
    
    Plotly.newPlot('plot-likes', data, layout, config);
  })
}
