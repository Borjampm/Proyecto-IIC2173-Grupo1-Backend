let {} = require('../parameters/response_values');

function parser(dataAsString) {
    let parsedData = JSON.parse(dataAsString);
    
    if (parsedData['stocks'] != undefined) 
    {
        console.log("> Parsed stocks/info");
        const dictStocks = JSON.parse(parsedData['stocks']);
        parsedData['stocks'] = dictStocks;
    }
    else if (parsedData['stocks_id'] != undefined) 
    {
        console.log("> Parsed stocks/validation");
    }

    return parsedData;
}

module.exports = parser;
