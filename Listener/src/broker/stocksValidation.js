const responseParser = require('../utils/parser')
const axios = require('axios')

const group = 1;

function listenValidation(topic, message, url) {
    processedMessage = responseParser(message.toString())

    if (parseInt(processedMessage.group_id) === group) {
        console.log(`[LISTENER ${topic}]`, processedMessage.request_id, processedMessage.valid)
        postValidationInAPI(processedMessage);
    } else {
        console.log(`[LISTENER ${topic}] > Message of the group:`, processedMessage.group_id)
    }
}

function postValidationInAPI(response) {
    const body = {
        request_id: response.request_id,
        seller: response.seller,
        valid: response.valid
    }
    axios
        .post(`${API_URL}/transactions/validate`, body)
        .then((res) => {
            console.log('[LISTENER stocks/validation] Response posted in API')
        })
        .catch((error) => {
            console.error('[LISTENER stocks/validation] Error posting response in API', error)
        })
}

module.exports = {
    listenValidation
}