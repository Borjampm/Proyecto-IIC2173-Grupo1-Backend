const responseParser = require('./utils/parser')
const axios = require('axios')

const topic = 'stocks/info'

function suscribeInfo(url, client) {
    console.log('[LISTENER stock/info] Connected to', url, topic)

    client.subscribe(topic, function (err) {
        if (err) {
            console.log(err)
        }
    })
}

function listenStocks(topic, message, url) {
    processedMessage = responseParser(message.toString())

    console.log('[LISTENER stock/info]', processedMessage.stocks_id, processedMessage.datetime)
    postResponseInAPI(processedMessage, )
}

function postResponseInAPI(response) {
    const body = {
        stocks: response.stocks,
        stocks_id: response.stocks_id,
        datetime: response.datetime
    }
    axios
        .post(`${API_URL}/stocks/new`, body)
        .then((res) => {
            console.log('[LISTENER] Response posted in API')
        })
        .catch((error) => {
            console.error('[LISTENER] Error posting response in API', error)
        })
}

module.exports = {
    suscribeInfo,
    listenStocks
}