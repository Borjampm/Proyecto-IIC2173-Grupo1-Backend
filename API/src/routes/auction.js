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


// NEW ENDPOINTS ---------------------------

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
            ctx.body = "Offer saved";
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
                    // save proposal
                    await ctx.orm.Proposal.create({
                        proposal_id: request.proposal_id,
                        auction_id: request.auction_id,
                        offered_stock: request.stock_id,
                        offered_quantity: request.quantity,
                        group_id: request.group_id,
                        state: 'waiting'
                    });
                    ctx.body = "My proposal saved";
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
                    ctx.body = "Proposal saved";
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
                    // find all proposals
                    const proposals = await ctx.orm.Proposal.findAll({
                        where: {
                            auction_id: request.auction_id
                        }
                    });
                    // update all proposals
                    for (let i = 0; i < proposals.length; i++) {
                        proposals[i].state = 'rejection';
                        await proposals[i].save();
                    }
                    // find proposal
                    const Proposal = await ctx.orm.Proposal.findOne({
                        where: {
                            proposal_id: request.proposal_id
                        }
                    });
                    // update proposal
                    Proposal.state = 'accepted';
                    await Proposal.save();
                    // update auction
                    auction.state = 'accepted';
                    await auction.save();
                    // check if stock exists, if not, create
                    const offeredStocks = await ctx.orm.AvailableStock.findOne({
                        where: {
                            stock_id: auction.stock_id
                        }
                    });
                    if (offeredStocks) {
                        offeredStocks.amount += auction.quantity;
                        await offeredStocks.save();
                    } else {
                        await ctx.orm.AvailableStock.create({
                            stock_id: auction.stock_id,
                            amount: auction.quantity
                        });
                    }
                    // check if stock exists, if not, create
                    const proposedStocks = await ctx.orm.AvailableStock.findOne({
                        where: {
                            stock_id: Proposal.offered_stock
                        }
                    });
                    proposedStocks.amount -= auction.quantity;
                    await proposedStocks.save();
                    // mark auction as completed
                    auction.state = 'completed';
                    await auction.save();
                    ctx.body = "My proposal was accepted";
                    console.log('[Proposals] Saved my accepted proposal by other group')
                } else {
                    // find all proposals
                    const proposals = await ctx.orm.Proposal.findAll({
                        where: {
                            auction_id: request.auction_id
                        }
                    });
                    // update all proposals
                    for (let i = 0; i < proposals.length; i++) {
                        proposals[i].state = 'rejection';
                        await proposals[i].save();
                    }
                    // find proposal
                    const Proposal = await ctx.orm.Proposal.findOne({
                        where: {
                            proposal_id: request.proposal_id
                        }
                    });
                    // update proposal
                    Proposal.state = 'accepted';
                    await Proposal.save();
                    // update auction
                    auction.state = 'accepted';
                    await auction.save();
                    // update amount of stocks
                    const offeredStocks = await ctx.orm.AvailableStock.findOne({
                        where: {
                            stock_id: auction.stock_id
                        }
                    });
                    offeredStocks.amount -= auction.quantity;
                    await offeredStocks.save();
                    // check if stock exists, if not, create
                    const proposedStocks = await ctx.orm.AvailableStock.findOne({
                        where: {
                            stock_id: Proposal.offered_stock
                        }
                    });
                    if (proposedStocks) {
                        proposedStocks.amount += Proposal.offered_quantity;
                        await proposedStocks.save();
                    } else {
                        await ctx.orm.AvailableStock.create({
                            stock_id: Proposal.offered_stock,
                            amount: Proposal.offered_quantity
                        });
                    }
                    ctx.body = "Proposal accepted";
                    console.log('[Proposals] Saved my accepted proposal by me')
                }
            }
        } else {
            // check if auction exists, if not, ignore
            const auction = await ctx.orm.Auction.findOne({
                where: {
                    auction_id: request.auction_id
                }
            });
            if (auction) {
                // check if group is 1
                if (request.group_id === 1) {
                    // update proposal to rejected
                    const Proposal = await ctx.orm.Proposal.findOne({
                        where: {
                            proposal_id: request.proposal_id
                        }
                    });
                    Proposal.state = 'rejection';
                    await Proposal.save();
                    ctx.body = "My proposal was rejected";
                    console.log('[Proposals] Saved my rejected proposal by other group')
                } else {
                    // update proposal to rejected
                    const Proposal = await ctx.orm.Proposal.findOne({
                        where: {
                            proposal_id: request.proposal_id
                        }
                    });
                    Proposal.state = 'rejection';
                    await Proposal.save();
                    ctx.body = "Proposal rejected";
                    console.log('[Proposals] Saved my rejected proposal by me')
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

// Show specific auction
router.get('auctions.showspecific', '/show/:auction_id', async (ctx) => {
    try {
        // find auction
        const auction = await ctx.orm.Auction.findOne({
            where: {
                auction_id: ctx.params.auction_id
            }
    });
        ctx.body = auction;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
    }
});

// Show offers from other groups
router.get('auctions.showothers', '/offers', async (ctx) => {
    try {
        // find all offers from other groups
        const auctions = await ctx.orm.Auction.findAll({
            where: {
                type: 'offer',
                group_id: {
                    [ctx.orm.Sequelize.Op.ne]: 1
                }
            }

    });
        ctx.body = auctions;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
    }
});

// Show offers from my group
router.get('auctions.showmine', '/my-offers', async (ctx) => {
    try {
        // find all offers from other groups
        const auctions = await ctx.orm.Auction.findAll({
            where: {
                type: 'offer',
                group_id: 1,
                state: 'waiting'
            }

    });
        ctx.body = auctions;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
    }
});

// Show all proposals for a specific offer
router.get('auctions.show', '/proposals/:auction_id', async (ctx) => {
    try {
        // find all proposals for a specific offer
        const proposals = await ctx.orm.Proposal.findAll({
            where: {
                auction_id: ctx.params.auction_id,
                state: 'waiting'
            }
    });
        ctx.body = proposals;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
    }
});

// Show my active proposals
router.get('auctions.show', '/my-proposals', async (ctx) => {
    try {
        // find all proposals for a specific offer
        const proposals = await ctx.orm.Proposal.findAll({
            where: {
                group_id: 1,
                state: 'waiting'
            }
    });
        ctx.body = proposals;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
    }
});

// Show my active proposals
router.get('auctions.show', '/my-proposals/history', async (ctx) => {
    try {
        // find all proposals for a specific offer
        const proposals = await ctx.orm.Proposal.findAll({
            where: {
                group_id: 1
            }
    });
        ctx.body = proposals;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
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



module.exports = router;
