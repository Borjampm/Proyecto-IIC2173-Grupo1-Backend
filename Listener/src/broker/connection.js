const mqtt = require('mqtt')
const loadCredentials = require('./parameters/credentials')
const { suscribe, listenStocks } = require('./stocksInfo')

const API_URL = process.env.API_URL;
const URL = `mqtt://${credentials.HOST}:${credentials.PORT}`
const credentials = loadCredentials()

const options = {
    clean: true,
    connectTimeout: 4000,
    username: credentials.USER,
    password: credentials.PASSWORD,
}

function connectToBroker() {
    connectStocksInfo()    
}

function connectStocksInfo() {
    const client = mqtt.connect(URL, options)

    client.on('connect', suscribeInfo(URL, client))

    client.on('message', listenStocks(message, url))
}

module.exports = connectToBroker;