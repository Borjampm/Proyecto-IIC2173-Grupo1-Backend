const Router = require('koa-router');
// const { Op } = require('sequelize');
const { consoleError, generalError } = require('../parameters/errors.js');
// const { defaultPage, defaultSize } = require('../parameters/request.js');
// const { getStartIndex } = require('../utils/request.js');

const router = new Router();

router.get('stock.available', '/all', async (ctx) => {
    try {
        const stocks = await ctx.orm.AvailableStock.findAll();
        ctx.body = stocks;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// get available stocks from company
router.get('stock.available', '/company/:symbol', async (ctx) => {
    try {
        const stock = await ctx.orm.AvailableStock.findOne({
            where: {
                stock_id: ctx.params.symbol,
            },
        });
        ctx.body = stock;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});


// add a new stock to the available stocks
router.post('stock.available', '/add', async (ctx) => {
    try {
        const request = ctx.request.body;
        const stock = await ctx.orm.AvailableStock.create({
            stock_id: request.stock_id,
            amount: request.amount,
        });
        ctx.body = stock;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});


module.exports = router;
