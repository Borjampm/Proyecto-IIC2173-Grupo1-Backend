const responseParser = require('../utils/parser')
const axios = require('axios')

const group = 1;
const API_URL = process.env.API_URL;

function listenAuction(topic, message, url) {
    console.log(`[LISTENER ${topic}] > Recibida auction`)
    message = responseParser(message.toString())

    const body =
    {
        "auction_id": message.auction_id,
        "proposal_id": message.proposal_id,
        "stock_id": message.stock_id,
        "quantity": message.quantity,
        "group_id": message.group_id,
        "type": message.type,
    };

    axios
        .post(`${API_URL}/auctions/new`, body)
        .then((res) => {
            console.log(`[LISTENER ${topic}] Response posted in API`)
        })
        .catch((error) => {
            console.log(`[LISTENER ${topic}] Error posting response in API`, error)
        })
}

module.exports = {
    listenAuction
}
