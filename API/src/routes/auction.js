const Router = require('koa-router');
const mqtt = require('mqtt');
const { v4: uuidv4 } = require('uuid');
const { consoleError, generalError } = require('../parameters/errors.js');
// const { defaultPage, defaultSize } = require('../parameters/request.js');
// const { getStartIndex } = require('../utils/request.js');

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


// NEW ENDPOINT ---------------------------

// Add auction to database
router.post('auction.create', '/save', async (ctx) => {
    try {
        const request = ctx.request.body
        console.log(request)
        if (request.type === "offer") {
            await ctx.orm.Auction.create({
                auction_id: request.auction_id,
                proposal_id: request.proposal_id,
                stock_id: request.stock_id,
                quantity: request.quantity,
                group_id: request.group_id,
                type: request.type
            });
            console.log('[Proposals] Saved offer')
        } else if (request.type === "proposal") {
            // check if auction exists, if not, ignore
            const auction = await ctx.orm.Auction.findOne({
                where: {
                    auction_id: request.auction_id
                }
            });
            if (auction) {
                // check if group is 1
                if (request.group_id === 1) {
                    // handle my proposal
                    console.log('[Proposals] Saved my proposal')
                } else {
                    // handle other proposal
                    await ctx.orm.Proposal.create({
                        proposal_id: request.proposal_id,
                        auction_id: request.auction_id,
                        offered_stock: request.stock_id,
                        offered_quantity: request.quantity,
                        group_id: request.group_id,
                        state: 'waiting'
                    });

                    console.log('[Proposals] Saved other proposal')
                }
            }
        } else if (request.type === "acceptance") {
            // check if auction exists, if not, ignore
            const auction = await ctx.orm.Auction.findOne({
                where: {
                    auction_id: request.auction_id
                }
            });
            if (auction) {
                // check if group is 1
                if (request.group_id === 1) {
                    // handle other acceptance
                    console.log('[Proposals] Saved my accepted proposal by other group')
                } else {
                    // handle my acceptance
                    await ctx.orm.Proposal.update({
                        state: 'accepted'
                    }, {
                        where: {
                            proposal_id: request.proposal_id
                        }
                    });
                    // update auction
                    auction.state = 'accepted';
                    await auction.save();
                    // update amount of stocks
                    console.log('[Proposals] Saved my accepted proposal by me')
                }
            }
        }
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// Send auction to broker
router.post('auction.create', '/send', async (ctx) => {
    try {
        const request = ctx.request.body
        const message =  {
            "auction_id": request.auction_id,
            "proposal_id": request.proposal_id,
            "stock_id": request.stock_id,
            "quantity": request.quantity,
            "group_id": request.group_id,
            "type": request.type
        };
        const payload = JSON.stringify(message);
        client.publish('stocks/auctions', payload);
        console.log('[API] Auction sent')
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});




// OLD ENDPOINT ---------------------------

// show all auctions offering stocks
router.get('auctions.show', '/offers', async (ctx) => {
    try {
        const auctions = await ctx.orm.Auction.findAll({
            where: {
                type: 'offer'
            }
    });
        ctx.body = auctions;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// show all my proposals
router.get('auctions.show', '/proposals', async (ctx) => {
    try {
        const auctions = await ctx.orm.Auction.findAll({
            where: {
                type: 'proposal',
                group_id: 1
            }
    });
        ctx.body = auctions;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// show proposals waiting for my response
router.get('auctions.show', '/waiting', async (ctx) => {
    try {
        const auctions = await ctx.orm.Auction.findAll({
            where: {
                type: 'proposal'
            }
    });
        ctx.body = auctions;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// Add a new auction to the database
// router.post('auction.create', '/new', async (ctx) => {
//     try {
//         const request = ctx.request.body
//         console.log(request)
//         // const newAuction = await ctx.orm.Auction.create({
//         await ctx.orm.Auction.create({
//             auction_id: request.auction_id,
//             proposal_id: request.proposal_id,
//             stock_id: request.stock_id,
//             quantity: request.quantity,
//             group_id: request.group_id,
//             type: request.type
//         });
//         console.log('[API] Auction logged')
//         ctx.status = 201;
//     } catch (error) {
//         console.error(consoleError, error);
//         ctx.body = generalError;
//         ctx.status = 400;
//     }
// });

// Estos dos metodos no deberían ser posts, pero por ahora si lo son
// Offer a new auction
router.post('auction.propose', '/offer-new', async (ctx) => {
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

// Propose to an offered auction
router.post('auction.propose', '/propose', async (ctx) => {
    try {
        console.log('posting')
        const request = ctx.request.body
        const message =  {
            "auction_id": request.auction_id,
            "proposal_id": uuidv4(),
            "stock_id": request.stock_id,
            "quantity": request.quantity,
            "group_id": 1,
            "type": "proposal"
        };
        const payload = JSON.stringify(message);
        client.publish('stocks/auctions', payload);
        // find auction and update proposal_id
        const auction = await ctx.orm.Auction.findOne({
            where: {
                auction_id: request.auction_id
            }
        });
        auction.proposal_id = message.proposal_id;
        auction.type = 'proposal';
        await auction.save();
        ctx.body = message;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// Test offer
router.get('auction.propose', '/test', async (ctx) => {
    try {
        console.log('posting')
        const message =  {
            "auction_id": uuidv4(),
            "proposal_id": '483013b8-c88f-473f-9067-070fd636dca9',
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

// TODO: Accept or reject proposals
module.exports = router;
