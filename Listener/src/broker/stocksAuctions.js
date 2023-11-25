const responseParser = require('../utils/parser')
const axios = require('axios')

const group = 1;
const API_URL = process.env.API_URL;

function listenAuction(topic, message, url) {
    processedMessage = responseParser(message.toString())
    console.log("Auction received", processedMessage)

    // const body = {
    // }
    // axios
    //     .post(`${API_URL}/transactions/validate`, body)
    //     .then((res) => {
    //         console.log('[LISTENER stocks/validation] Response posted in API')
    //     })
    //     .catch((error) => {
    //         console.error('[LISTENER stocks/validation] Error posting response in API', error)
    //     })
}


module.exports = {
    listenAuction
}
