const Router = require('koa-router');
const { consoleError, generalError } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex } = require('../utils/request.js');

const router = new Router();

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
        console.log('[API] Auction logged', ctx.body)
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;
