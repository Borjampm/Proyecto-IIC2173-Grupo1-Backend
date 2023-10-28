const responseParser = require('../utils/parser')
const axios = require('axios')

const API_URL = process.env.API_URL;

function listenStocks(topic, message) {
    processedMessage = responseParser(message.toString())

    if(processedMessage.stocks_id != undefined) {
        console.log(`[LISTENER ${topic}]`, processedMessage.stocks_id, processedMessage.datetime);
        postStocksInAPI(processedMessage);
    }
}

function postStocksInAPI(response) {
    const body = {
        stocks: response.stocks,
        stocks_id: response.stocks_id,
        datetime: response.datetime
    }
    axios
        .post(`${API_URL}/stocks/new`, body)
        .then((res) => {
            console.log('[LISTENER stocks/info] Response posted in API')
        })
        .catch((error) => {
            console.error('[LISTENER stocks/info] Error posting response in API', error)
        })
}

module.exports = {
    listenStocks
}