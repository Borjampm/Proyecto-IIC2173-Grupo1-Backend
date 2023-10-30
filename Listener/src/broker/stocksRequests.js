const responseParser = require('../utils/parser')
const axios = require('axios')

const API_URL = process.env.API_URL;

function listenRequests(topic, message, url) {
    processedMessage = responseParser(message.toString())

    console.log(`[LISTENER ${topic}] > Recibida request:`, processedMessage.group_id, processedMessage.request_id)
    postRegisterInAPI(processedMessage);
}

function postRegisterInAPI(response) {
    const body = {
        request_id: response.request_id,
        group_id: response.group_id,
        symbol: response.symbol,
        datetime: response.datetime,
        quantity: response.quantity
    }
    axios
        .post(`${API_URL}/registers/new`, body)
        .then((res) => {
            console.log('[LISTENER stocks/requests] Register posted in API')
        })
        .catch((error) => {
            console.error('[LISTENER stocks/requests] Error posting register in API', error)
        })
}

module.exports = {
    listenRequests
}