const Router = require('koa-router');
const { consoleError, generalError, stock404 } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex, getEndIndex } = require('../utils/request.js');

const router = new Router();

router.post('stock.create', '/new', async (ctx) => {
    try {
        const request = ctx.request.body

        const stocksId = request.stocks_id;
        const datetime = request.datetime;
        const stocks = request.stocks;

        for (let k in stocks) {
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
            let newStock = await ctx.orm.Stocks.create({
                stocksId: stocksId,
                datetime: datetime,
                price: stocks[k].price,
                currency: stocks[k].currency,
                source: stocks[k].source
            })
            // associate stock with company
            await ctx.orm.CompanyStocks.create({
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
        // const page = parseInt(ctx.query.page) || defaultPage;
        // const size = parseInt(ctx.query.size) || defaultSize;

        // const startIndex = getStartIndex(page, size);

        // const stocks = await ctx.orm.Stocks.findAll({
        //     offset: startIndex,
        //     limit: size,
        // });
        const latestStocks = {};
        const companies = await ctx.orm.Company.findAll();
        for (let k in companies) {
            const company = companies[k];
            const companyStocks = await ctx.orm.CompanyStocks.findOne({
                where: { companyId: company.id },
            });
            const latestStock = await ctx.orm.Stocks.findOne({
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

router.get('stock.info', '/info', async (ctx) => {
    try {
        const stocks = await ctx.orm.Stock.findAll();
        const firstStock = stocks[0];
        const lastStock = stocks[stocks.length - 1];

        const symbols = ['AAPL', 'AMZN', 'TSLA', 'MSFT', 'NFLX', 'GOOGL', 'NVDA', 'META', 'WMT', 'SHEL', 'LTMAY', 'COMP', 'MA', 'PG', 'AVGO']
        let companies = [];

        for (index in symbols) {
            const data = await ctx.orm.Company.findAll({
                where: {
                    symbol: symbols[index]
                }
            })

            const lastIndex = data.length - 1;

            const company = {
                name: `${data[0].symbol} - ${data[0].shortName}`,
                first_price: `${data[0].price} ${data[0].currency}`,
                last_price: `${data[lastIndex].price} ${data[lastIndex].currency}`,
                source: data[0].source
            }
            companies.push(company);
        }

        const numberOfStocks = await ctx.orm.Stock.count();

        ctx.body = {
            number_of_stocks: numberOfStocks,
            first_stock: `[ID] ${firstStock.stocks_id} | [DATE] ${firstStock.datetime}`,
            last_stock: `[ID] ${lastStock.stocks_id} | [DATE] ${lastStock.datetime}`,
            companies_info: companies
        }
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});


module.exports = router;
