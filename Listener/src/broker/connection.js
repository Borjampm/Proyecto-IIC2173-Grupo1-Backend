const mqtt = require('mqtt')
const loadCredentials = require('../parameters/credentials')
const { listenStocks } = require('./stocksInfo')
const { listenValidation } = require('./stocksValidation')
const { listenRequests } = require('./stocksRequests')

const credentials = loadCredentials()
const URL = `mqtt://${credentials.HOST}:${credentials.PORT}`

const options = {
    clean: true,
    connectTimeout: 4000,
    username: credentials.USER,
    password: credentials.PASSWORD,
}

function connectToBroker() {
    const client = mqtt.connect(URL, options);

    client.on('connect', function () {  
        suscribe(URL, client, 'stocks/info');
        suscribe(URL, client, 'stocks/validation');
        suscribe(URL, client, 'stocks/requests');
    })

    client.on('message', function (topic, message) {
        console.log(`[LISTENER ${topic}] Message received`)
        if (topic === 'stocks/info') {
            listenStocks(topic, message, URL);
        } else if (topic === 'stocks/validation') {
            listenValidation(topic, message, URL);
        } else {
            listenRequests(topic, message, URL);
        }
    })
}

function suscribe(url, client, topic) {
    console.log(`[LISTENER ${topic}] Connected to`, url)

    client.subscribe(topic, function (err) {
        if (err) {
            console.log(`[LISTENER ${topic}]`, err)
        }
    })
}

module.exports = connectToBroker;