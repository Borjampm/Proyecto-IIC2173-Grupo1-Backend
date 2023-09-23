const Router = require('koa-router');
const { Op } = require('sequelize');
const { consoleError, generalError, stock404 } = require('../parameters/errors.js');
const axios = require('axios');
const router = new Router();
const mqtt = require('mqtt');

const topic = 'stocks/requests';

const MQTT_BROKER_URL = 'mqtt://broker.legit.capital';
const MQTT_PORT = 9000;
const MQTT_USER = 'students';
const MQTT_PASSWORD = 'iic2173-2023-2-students';

const client = mqtt.connect(MQTT_BROKER_URL, {
port: MQTT_PORT,
username: MQTT_USER,
password: MQTT_PASSWORD,
});

// Listen for MQTT connect event
client.on('connect', () => {
console.log('Connected to MQTT broker');
});

// Listen for MQTT error event
client.on('error', (error) => {
console.error('MQTT error:', error);
});
// Post para crear una órden de compra
router.post('/buy', async (ctx) => {

    try {
        const request = ctx.request.body;
        const user = await ctx.orm.User.findOne({
            where: {
                Username: request.Username
            }
        });
        const company = await ctx.orm.Company.findOne({
            where: {
                symbol: request.Symbol
            }
        });
        const TotalAmount = request.Price * request.Quantity;
        if (user.Wallet < TotalAmount) {
            ctx.body = {
                message: "You don't have enough money to buy this stock"
            };
            ctx.status = 400;
            return;
        } else {
            console.log("buiiiiing")
            user.Wallet -= TotalAmount;
            await user.save();

        }
        const transaction = await ctx.orm.Transaction.create({
            Username: user.Username,
            CompanyId: company.id,
            Price: request.Price,
            Currency: request.Currency,
            TotalAmount: TotalAmount,
            Quantity: request.Quantity,
            Date: new Date().toISOString(),
            Completed: false,
            ipAdress: request.IPAddres,
            UserId: 1

        });
        try {
            const message = {
              request_id: 'be0e538d-c983-43e8-957b-391746eb4236',
              group_id: '1',
              symbol: 'AAPL',
              datetime: 'hola',
              deposit_token: '',
              quantity: 10,
              seller: 0,
            };
            const payload = JSON.stringify(message);
        
            
        
            // Publish the message to the MQTT topic
            client.publish(topic, payload);
            console.log("works?")
        
            ctx.status = 200;
            ctx.body = { message: 'MQTT message published successfully' };
          } catch (error) {
            console.error('Error publishing MQTT message:', error);
            ctx.status = 500;
            ctx.body = { error: 'Failed to publish MQTT message' };
          }
        // axios
        //     .post('localhost:1313/publish-mqtt-message/', postData)
        //     .then((response) => {
        //         console.log('Message published successfully:', response.data);
        //     })
        //     .catch((error) => {
        //         console.error('Error publishing message:', error);
        // });
        ctx.body = transaction;
    } catch (error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 400;
    }
});

// Post para actualizar una órden de compra
router.post('/validate', async (ctx) => {
    try {
        const request = ctx.request.body;
        const transaction = await ctx.orm.Transaction.findOne({
            where: {
                id: request.request_id
            }
        });
        if (request.valid) {
            transaction.Completed = true;
        } else {
            transaction.Completed = false;}
        await transaction.save();
        ctx.body = transaction;
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
    }
});



router.get('transiction.user', '/:username', async (ctx) => {
    try {

        const transactions = await ctx.orm.Transaction.findAll({
            where: {
              Username: {
                [Op.iLike]: `%${ctx.params.username}%`
              }
            }
          });

        const list = transactions.map((transactions) => ({
            id: transactions.id,
            Username: transactions.Username,
            CompanyId: transactions.CompanyId,
            Quantity: transactions.Quantity,
            Price: transactions.Price,
            Currency: transactions.Currency,
            TotalAmount: transactions.TotalAmount,
            Completed: transactions.Completed
        }));
        
        ctx.body = {
            stocks_data: list
        }
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});







module.exports = router;
