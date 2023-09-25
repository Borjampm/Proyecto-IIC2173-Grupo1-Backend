const Router = require('koa-router');
const { Op } = require('sequelize');
const { consoleError, generalError, company404 } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex } = require('../utils/request.js');

const router = new Router();

router.get('company.show', '/all', async (ctx) => {
    try {
        const page = parseInt(ctx.query.page) || defaultPage;
        const size = parseInt(ctx.query.size) || defaultSize;

        const startIndex = getStartIndex(page, size);

        const companies = await ctx.orm.Company.findAll({
            offset: startIndex,
            limit: size
        });

        ctx.body = companies.map((company) => ({
            id: company.id,
            stocks_id: company.stocksId,
            symbol: company.symbol,
            shortName: company.shortName,
            price: company.price,
            currency: company.currency,
            source: company.source
        }));

        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('company.symbol', '/:symbol/data', async (ctx) => {
    try {
        const page = parseInt(ctx.query.page) || defaultPage;
        const size = parseInt(ctx.query.size) || defaultSize;

        const startIndex = getStartIndex(page, size);

        const companies = await ctx.orm.Company.findAll({
            where: {
              symbol: {
                [Op.iLike]: `%${ctx.params.symbol}%`
              }
            },
            offset: startIndex,
            limit: size
          });

        const {symbol} = companies[0];
        const {shortName} = companies[0];
        const {source} = companies[0];

        const list = companies.map((company) => ({
            id: company.id,
            stocks_id: company.stocksId,
            price: company.price,
            currency: company.currency,
        }));
        
        ctx.body = {
            symbol,
            shortName,
            source,
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