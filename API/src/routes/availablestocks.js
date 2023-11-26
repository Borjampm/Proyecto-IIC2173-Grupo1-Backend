const Router = require('koa-router');
// const { Op } = require('sequelize');
const { consoleError, generalError } = require('../parameters/errors.js');
// const { defaultPage, defaultSize } = require('../parameters/request.js');
// const { getStartIndex } = require('../utils/request.js');

const router = new Router();

router.get('stock.available', '/all', async (ctx) => {
    try {
        const registers = await ctx.orm.Register.findAll({
            where: {
                seller: 1
            }
        });

        ctx.body = registers;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;
