const mqtt = require('mqtt')
const loadCredentials = require('../parameters/credentials')
const { suscribeInfo, listenStocks } = require('./stocksInfo')

const credentials = loadCredentials()
const API_URL = process.env.API_URL;
const URL = `mqtt://${credentials.HOST}:${credentials.PORT}`

const options = {
    clean: true,
    connectTimeout: 4000,
    username: credentials.USER,
    password: credentials.PASSWORD,
}

function connectToBroker() {
    const client = mqtt.connect(URL, options)

    connectStocksInfo(client)    
}

function connectStocksInfo(client) {
    client.on('connect', function () {
        suscribeInfo(URL, client)
    })
    client.on('message', function () {
        listenStocks(message, url)
    })
}

module.exports = connectToBroker;