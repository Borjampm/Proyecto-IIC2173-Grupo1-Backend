const responseParser = require('../utils/parser')
const axios = require('axios')

const group = 1;
const API_URL = process.env.API_URL;

function listenAuction(topic, message, url) {
    processedMessage = responseParser(message.toString())
    console.log("Auction received", processedMessage)

    if (processedMessage.proposal_id == "") {
        processedMessage.proposal_id = null;
    }

    const body =
    {
        "auction_id": processedMessage.auction_id,
        "proposal_id": processedMessage.proposal_id,
        "stock_id": processedMessage.stock_id,
        "quantity": processedMessage.quantity,
        "group_id": processedMessage.group_id,
        "type": processedMessage.type,
    };

    if (processedMessage.group_id == "1" || processedMessage.group_id == "2") {
    }
        console.log("Auction sent", body)
        axios
            .post(`${API_URL}/auctions/save`, body)
            .then((res) => {
                console.log('[LISTENER stocks/validation] Response posted in API')
            })
            .catch((error) => {
                console.error('[LISTENER stocks/validation] Error posting response in API', error)
            })

}


module.exports = {
    listenAuction
}
