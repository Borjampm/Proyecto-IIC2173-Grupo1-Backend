const Router = require('koa-router');
const { consoleError, generalError } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex } = require('../utils/request.js');
const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid');

const router = new Router();

const MQTT_BROKER_URL = 'mqtt://broker.legit.capital';
const MQTT_PORT = 9000;
const MQTT_USER = 'students';
const MQTT_PASSWORD = 'iic2173-2023-2-students';

const client = mqtt.connect(MQTT_BROKER_URL, {
    port: MQTT_PORT,
    username: MQTT_USER,
    password: MQTT_PASSWORD,
    });

router.get('auctions.show', '/all', async (ctx) => {
    try {
        const auctions = await ctx.orm.Auction.findAll();
        ctx.body = auctions;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.post('auction.create', '/new', async (ctx) => {
    try {
        const request = ctx.request.body
        console.log(request)
        const newAuction = await ctx.orm.Auction.create({
            auction_id: request.auction_id,
            proposal_id: request.proposal_id,
            stock_id: request.stock_id,
            quantity: request.quantity,
            group_id: request.group_id,
            type: request.type
        });
        console.log('[API] Auction logged')
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// Estos dos metodos no deberían ser posts, pero por ahora si lo son

router.get('auction.propose', '/offer', async (ctx) => {
    try {
        const message =  {
            "auction_id": uuidv4(),
            "proposal_id": "",
            "stock_id": uuidv4(),
            "quantity": 2,
            "group_id": 1,
            "type": "offer"
        };
        const payload = JSON.stringify(message);
        client.publish('stocks/auctions', payload);
        ctx.body = message;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('auction.propose', '/propose', async (ctx) => {
    try {
        console.log('posting')
        const message =  {
            "auction_id": 1234,
            "proposal_id": "",
            "stock_id": 1234,
            "quantity": 2,
            "group_id": 1,
            "type": "proposal"
        };
        const payload = JSON.stringify(message);
        client.publish('stocks/auctions', payload);
        ctx.body = message;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;
