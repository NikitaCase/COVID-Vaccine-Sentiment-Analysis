// select listeners
var sentiment = d3.select("#selSentiment");
var company = d3.select("#selCompanywc");

// Select Plot Area 
var cloud = d3.select('#display-cloud');

function UpdateCloud() {
    var user_sentiment = sentiment.property("value")
    console.log(user_sentiment)

    var user_company = company.property("value")
    console.log(user_company)

    cloud.html("")

    if (user_company === 'az') {
        if (user_sentiment === 'pos') { cloud.html('<img src="/images/cloud-az-p.png"></img') } else if (user_sentiment === 'neg') { cloud.html('<img src="/images/cloud-az-n.png"></img') } else { cloud.html('<img src="/images/cloud-az.png"></img') }
    } else if (user_company === 'mo') {
        if (user_sentiment === 'pos') { cloud.html('<img src="/images/cloud-mo-p.png"></img') } else if (user_sentiment === 'neg') { cloud.html('<img src="/images/cloud-mo-n.png"></img') } else { cloud.html('<img src="/images/cloud-mo.png"></img') }
    } else if (user_company === 'pf') {
        if (user_sentiment === 'pos') { cloud.html('<img src="/images/cloud-pf-p.png"></img') } else if (user_sentiment === 'neg') { cloud.html('<img src="/images/cloud-pf-n.png"></img') } else { cloud.html('<img src="/images/cloud-pf.png"></img') }
    } else {
        if (user_sentiment === 'pos') { cloud.html('<img src="/images/cloud-vac-p.png"></img') } else if (user_sentiment === 'neg') { cloud.html('<img src="/images/cloud-vac-n.png"></img') } else { cloud.html('<img src="/images/cloud-vac.png"></img') }
    }
};


company.on('change', UpdateCloud);

sentiment.on('change', UpdateCloud);

UpdateCloud();