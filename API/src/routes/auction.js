const Router = require('koa-router');
const { consoleError, generalError } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex } = require('../utils/request.js');

const router = new Router();

router.get('auctions.show', '/all', async (ctx) => {
    try {
        ctx.body = "Hello"
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

        //     // create stock
        //     const newStock = await ctx.orm.Stock.create({
        //         stocksId,
        //         datetime,
        //         price: stocks[k].price,
        //         currency: stocks[k].currency,
        //         source: stocks[k].source
        //     })
        //     // associate stock with company
        //     await ctx.orm.CompanyStock.create({
        //         companyId: company.id,
        //         stockId: newStock.id
        // })
        console.log('[API] Auction logged', ctx.body)
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;
