const Router = require('koa-router');
const mqtt = require('mqtt');
const { Op } = require('sequelize');

const {WebpayPlus} = require("transbank-sdk"); // CommonJS
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require("transbank-sdk"); // CommonJS
const { consoleError, generalError } = require('../parameters/errors.js');

const router = new Router();

const topicRequests = 'stocks/requests';
const topicValidate = 'stocks/validation';

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
        console.log("TOTAL AMOUNT", TotalAmount)
        if (user.Wallet < TotalAmount) {
            ctx.body = {
                message: "You don't have enough money to buy this stock"
            };
            ctx.status = 200;
        } else {
            // Create Transaction
            user.Wallet -= TotalAmount;
            await user.save();
            const transaction = await ctx.orm.Transaction.create({
                Username: user.Username,
                CompanyId: company.id,
                Price: request.Price,
                Currency: "USD",
                TotalAmount,
                Quantity: request.Quantity,
                Date: new Date().toISOString(),
                Completed: false,
                ipAdress: request.IPAddres,
                UserId: user.id
            });

            // Webpay implementation
            const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
            console.log('attempting webpay')
            const returnURL = `${process.env.FRONT_URL}/validate-transaction`;
            console.log(returnURL);
            const response = await tx.create('buy_order', transaction.id, TotalAmount*100, returnURL);
            console.log(response);
            console.log("buiiiiing")

            // Create broker message
            try {
                const message = {
                request_id: transaction.id,
                group_id: '1',
                symbol: company.symbol,
                datetime: transaction.date,
                deposit_token: response.token,
                quantity: transaction.Quantity,
                seller: 0,
                };
                const payload = JSON.stringify(message);

                // Publish the message to the MQTT topic_requests
                client.publish(topicRequests, payload);
                console.log("works?")
            } catch (error) {
                console.error('Error publishing MQTT message:', error);
                ctx.status = 500;
                ctx.body = { error: 'Failed to publish MQTT message' };
            }

            // ctx.status = 200;
            // ctx.body = { message: 'MQTT message published successfully' };
            // ctx.body = transaction;
            ctx.status = 200;
            ctx.body = response;
        }
    } catch (error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 400;
    }
});

// post para comprar para admins
router.post('/admin/buy', async (ctx) => {
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

        const TotalAmount = parseInt(request.Price * request.Quantity);
        
        const transaction = await ctx.orm.Transaction.create({
            Username: user.Username,
            CompanyId: company.id,
            Price: request.Price,
            Currency: "USD",
            TotalAmount,
            Quantity: request.Quantity,
            Date: new Date().toISOString(),
            Completed: false,
            ipAdress: request.IPAddres,
            UserId: user.id
        });

        // Webpay implementation
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        console.log('attempting webpay')
        const returnURL = `${process.env.FRONT_URL}/validate-transaction`;
        console.log(returnURL);
        const response = await tx.create('buy_order', transaction.id, TotalAmount*100, returnURL);
        console.log(response);
        console.log("buiiiiing")

        // Create broker message
        try {
            const message = {
                request_id: transaction.id,
                group_id: '1',
                symbol: company.symbol,
                datetime: transaction.date,
                deposit_token: response.token,
                quantity: transaction.Quantity,
                seller: 1,
            };
            const payload = JSON.stringify(message);

            // Publish the message to the MQTT topic_requests
            client.publish(topicRequests, payload);
            console.log("works?")
        } catch (error) {
            console.error('Error publishing MQTT message:', error);
            ctx.status = 500;
            ctx.body = { error: 'Failed to publish MQTT message' };
        }

        // ctx.status = 200;
        // ctx.body = { message: 'MQTT message published successfully' };
        // ctx.body = transaction;
        ctx.status = 200;
        ctx.body = response;
    } catch (error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 400;
    }
});

router.post('/fraction/buy', async (ctx) => {
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

        const TotalAmount = parseInt(request.Price * request.Quantity);
        
        const transaction = await ctx.orm.Transaction.create({
            Username: user.Username,
            CompanyId: company.id,
            Price: request.Price,
            Currency: "USD",
            TotalAmount,
            Quantity: request.Quantity,
            Date: new Date().toISOString(),
            Completed: false,
            ipAdress: request.IPAddres,
            UserId: user.id
        });

        // Webpay implementation
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        console.log('attempting webpay')
        const returnURL = `${process.env.FRONT_URL}/validate-transaction`;
        console.log(returnURL);
        const response = await tx.create('buy_order', transaction.id, TotalAmount*100, returnURL);
        console.log(response);
        console.log("buiiiiing")

        // ctx.status = 200;
        // ctx.body = { message: 'MQTT message published successfully' };
        // ctx.body = transaction;
        ctx.status = 200;
        ctx.body = response;
    } catch (error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 400;
    }
});

router.post('/webpay-result', async (ctx) => {
    try {
        console.log("Checking status")
        const request = ctx.request.body;
        console.log(request);
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response = await tx.status(request.Token);
        console.log(response);
        const transaction = await ctx.orm.Transaction.findOne({
            where: {
                id: response.session_id
            }
        });
        if (response.vci == 'TSY') {
            transaction.Completed = true;
            await transaction.save();
            try {
                const message = {
                request_id: transaction.id,
                group_id: '1',
                seller: 0,
                valid: transaction.Completed
                };
                const payload = JSON.stringify(message);

                // Publish the message to the MQTT topic_requests
                client.publish(topicValidate, payload);
                console.log("works?")
                ctx.body = transaction;
                ctx.status = 200;
            } catch (error) {
                console.error('Error publishing MQTT message:', error);
                ctx.status = 500;
                ctx.body = { error: 'Failed to publish MQTT message' };
            }
        }

    } catch (error) {
        console.log(error, "error api")
        ctx.body = error;
        ctx.status = 400;
    }
});

// admin validate
router.post('/admin/webpay-result', async (ctx) => {
    try {
        console.log("Checking status")
        const request = ctx.request.body;
        console.log(request);
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response = await tx.status(request.Token);
        console.log(response);
        const transaction = await ctx.orm.Transaction.findOne({
            where: {
                id: response.session_id
            }
        });
        const company = await ctx.orm.Company.findOne({
            where: {
                id: transaction.CompanyId
            }
        });
        if (response.vci == 'TSY') {
            transaction.Completed = true;
            await transaction.save();
            try {
                // write message
                const message = {
                    request_id: transaction.id,
                    group_id: '1',
                    seller: 1,
                    valid: transaction.Completed
                };
                const payload = JSON.stringify(message);

                // Publish the message to the MQTT topic_requests
                client.publish(topicValidate, payload);

                // add stock to availablestocks
                const availableStock = await ctx.orm.AvailableStock.findOne({
                    where: {
                        stock_id: company.symbol
                    }
                });
                if (availableStock) {
                    availableStock.amount += transaction.Quantity;
                    await availableStock.save();
                } else {
                    await ctx.orm.AvailableStock.create({
                        stock_id: company.symbol,
                        amount: transaction.Quantity
                    });
                }

                console.log(availableStock, "available stock")
                ctx.body = transaction;
                ctx.status = 200;
            } catch (error) {
                console.error('Error publishing MQTT message:', error);
                ctx.status = 500;
                ctx.body = { error: 'Failed to publish MQTT message' };
            }
        }

    } catch (error) {
        console.log(error, "error api")
        ctx.body = error;
        ctx.status = 400;
    }
});

router.post('/fraction/webpay-result', async (ctx) => {
    try {
        console.log("Checking status")
        const request = ctx.request.body;
        console.log(request);
        const tx = new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
        const response = await tx.status(request.Token);
        console.log(response);
        const transaction = await ctx.orm.Transaction.findOne({
            where: {
                id: response.session_id
            }
        });
        const company = await ctx.orm.Company.findOne({
            where: {
                id: transaction.CompanyId
            }
        });
        console.log(company, "company")
        const CompanyStock = await ctx.orm.CompanyStock.findOne({
            where: {
                companyId: company.id
            }
        });
        console.log(CompanyStock, "company stock")
        const Stock = await ctx.orm.Stock.findOne({
            where: {
                id: CompanyStock.stockId
            }
        });
        console.log(Stock, "stock")
        if (response.vci == 'TSY') {
            transaction.Completed = true;
            await transaction.save();
            try {
                // remove from available stocks
                const availableStock = await ctx.orm.AvailableStock.findOne({
                    where: {
                        stock_id: Stock.stocksId
                    }
                });
                if (availableStock) {
                    availableStock.amount -= transaction.Quantity;
                    await availableStock.save();
                } else {
                    console.error("NO SE ENCONTRÓ EL STOCK")
                    ctx.status = 404;
                    ctx.body = { error: 'Failed to discount fraction' };
                }

                console.log(availableStock, "available stock")
                ctx.body = transaction;
                ctx.status = 200;
            } catch (error) {
                console.error('Error publishing MQTT message:', error);
                ctx.status = 500;
                ctx.body = { error: 'Failed to discount fraction' };
            }
        }

    } catch (error) {
        console.log(error, "error api")
        ctx.body = error;
        ctx.status = 400;
    }
});

// Post para actualizar una órden de compra
router.post('/validate', async (ctx) => {
    try {
        console.log("Listening purchase");
        const request = ctx.request.body;
        console.log(request);
        // console.log("VALIDATING")
        // const request = ctx.request.body;
        // const transaction = await ctx.orm.Transaction.findOne({
        //     where: {
        //         id: request.request_id
        //     }
        // });
        // if (request.valid) {
        //     console.log("ES VALIDO")
        //     transaction.Completed = true;
        // } else {
        //     console.log("NO ES VALIDO")
        //     transaction.Completed = false;}
        // await transaction.save();
        // ctx.body = transaction;
    } catch (error) {
        console.log(error, "error api")
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

        const list = transactions.map((trans) => ({
            id: trans.id,
            Username: trans.Username,
            CompanyId: trans.CompanyId,
            Quantity: trans.Quantity,
            Price: trans.Price,
            Currency: trans.Currency,
            TotalAmount: trans.TotalAmount,
            Completed: trans.Completed
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
