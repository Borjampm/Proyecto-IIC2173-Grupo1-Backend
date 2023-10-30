const Router = require('koa-router');
const { consoleError, generalError } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex } = require('../utils/request.js');
const { Op } = require('sequelize');

const router = new Router();

router.post('stock.create', '/new', async (ctx) => {
    try {
        const request = ctx.request.body

        const stocksId = request.stocks_id;
        const {datetime} = request;
        console.log(datetime)
        const {stocks} = request;

        for (const k in stocks) {
            // find if company exists
            let company = await ctx.orm.Company.findOne({
                where: {
                    symbol: stocks[k].symbol
                }
            })
            // if no company exists, create it
            if (!company) {
                company = await ctx.orm.Company.create({
                    symbol: stocks[k].symbol,
                    shortName: stocks[k].shortName,
                })
            }

            // create stock
            const newStock = await ctx.orm.Stock.create({
                stocksId,
                datetime,
                price: stocks[k].price,
                currency: stocks[k].currency,
                source: stocks[k].source
            })
            // associate stock with company
            await ctx.orm.CompanyStock.create({
                companyId: company.id,
                stockId: newStock.id
        })
        }
        console.log('[API] Stock created', ctx.body)
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('stock.show', '/', async (ctx) => {
    try {
        const latestStocks = {};
        const companies = await ctx.orm.Company.findAll();
        for (const k in companies) {
            const company = companies[k];
            const companyStocks = await ctx.orm.CompanyStock.findOne({
                where: { companyId: company.id },
            });
            const latestStock = await ctx.orm.Stock.findOne({
                where: { id: companyStocks.stockId },
                order: [['datetime', 'DESC']],
            });
            latestStocks[company.symbol] = latestStock.price;
        }
        ctx.body = latestStocks;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('stock.info', '/:symbol', async (ctx) => {
    try {
        const page = parseInt(ctx.query.page) || defaultPage;
        const size = parseInt(ctx.query.size) || defaultSize;

        const startIndex = getStartIndex(page, size);

        const company = await ctx.orm.Company.findOne({
            where: {
                symbol: ctx.request.params.symbol
            }
        });
        const companyStocks = await ctx.orm.Stock.findAll({
            offset: startIndex,
            limit: size,
            include: [{
                model: ctx.orm.CompanyStock,
                required: true,
                where: { companyId: company.id }
            }],
            order: [['datetime', 'DESC']]
        });
        const historicDetail = [];
        companyStocks.map (stock => {
            historicDetail.push({
                datetime: stock.datetime,
                price: stock.price,
                currency: stock.currency,
                source: stock.source
            })
        })
        ctx.body = {
            history: historicDetail
        }
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('stock.predict', '/:symbol/prediction_history', async (ctx) => {
    try {
        // Obtener la parte de la fecha de la cadena ISO 8601
        const day = ctx.query.day
        const date = day.split('T')[0]

        const company = await ctx.orm.Company.findOne({
            where: {
                symbol: ctx.request.params.symbol
            }
        });

        let offset = 0;
        const batchSize = 100;
        let moreRecords = true;
        const historicPrices = [];
        const historicDates = [];

        while (moreRecords) {
            const companyStocks = await ctx.orm.Stock.findAll({
                where: {
                    datetime: {
                        [Op.like]: `${date}%`
                    }
                },
                include: [{
                    model: ctx.orm.CompanyStock,
                    required: true,
                    where: { companyId: company.id }
                }],
                limit: batchSize,
                offset: offset
            });

            if (companyStocks.length > 0) {
                const prices = companyStocks.map(stock => stock.price);
                const dates = companyStocks.map(stock => stock.datetime);
                historicPrices.push(...prices);
                historicDates.push(...dates);
                offset += batchSize;
            } else {
                moreRecords = false;
            }
        }
        const transactions = historicPrices.length
        ctx.body = {
            prices: historicPrices,
            dates: historicDates,
            transactions: transactions
        };
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;
