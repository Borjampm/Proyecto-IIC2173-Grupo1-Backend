const mqtt = require('mqtt')
const axios = require('axios')
const loadCredentials = require('./credentials')
const responseParser = require('./response/parser')

const API_URL = process.env.API_URL;

function connectToBroker() {
    const credentials = loadCredentials()

    const URL = `mqtt://${credentials.HOST}:${credentials.PORT}`
    const topic = 'stocks/info'

    const options = {
        clean: true,
        connectTimeout: 4000,
        username: credentials.USER,
        password: credentials.PASSWORD,
    }

    const client = mqtt.connect(URL, options)

    client.on('connect', function () {
        console.log('[LISTENER] Connected to', URL, topic)

        client.subscribe(topic, function (err) {
            if (err) {
                console.log(err)
            }
        })
    })

    client.on('message', function (topic, message) {
        processedMessage = responseParser(message.toString())

        console.log('[LISTENER]', processedMessage.stocks_id, processedMessage.datetime)
        postResponseInAPI(processedMessage)
    })

    return client;
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

module.exports = connectToBroker;