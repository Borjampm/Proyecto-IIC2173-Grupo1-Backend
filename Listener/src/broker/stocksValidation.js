const responseParser = require('../utils/parser')
const axios = require('axios')

const group = 1;
const API_URL = process.env.API_URL;

function listenValidation(topic, message, url) {
    processedMessage = responseParser(message.toString())

    if (parseInt(processedMessage.group_id) === group) {
        console.log(`[LISTENER ${topic}]`, processedMessage.request_id, processedMessage.valid)
        postValidationInAPI(processedMessage);
    } else {
        console.log(`[LISTENER ${topic}] > Message of the group:`, processedMessage.group_id)
    }
    patchRegisterInAPI(processedMessage);
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

function patchRegisterInAPI(response) {
    const request_id = response.request_id;
    const valid = response.valid;

    axios
        .patch(`${API_URL}/registers/${request_id}/${valid}`)
        .then((res) => {
            console.log('[LISTENER stocks/validation] Register patched in API')
        })
        .catch((error) => {
            console.error('[LISTENER stocks/validation] Error patching register in API', error)
        })
}

module.exports = {
    listenValidation
}