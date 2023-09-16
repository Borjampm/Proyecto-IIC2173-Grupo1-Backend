const Router = require('koa-router');
const { consoleError, generalError, stock404 } = require('../parameters/errors.js');
const { defaultPage, defaultSize } = require('../parameters/request.js');
const { getStartIndex, getEndIndex } = require('../utils/request.js');

const router = new Router();

router.post('stock.create', '/new', async (ctx) => {
    try {
        const request = ctx.request.body
        
        const stock = await ctx.orm.Stock.create({
            stocks_id: request.stocks_id,
            datetime: request.datetime
        });

        const companies = [];

        for (element in request.stocks) {
            const data = request.stocks[element]
            const company = await ctx.orm.Company.create({
                symbol: data.symbol,
                shortName: data.shortName,
                price: data.price,
                currency: data.currency,
                source: data.source,
                stockId: request.stocks_id
            })
            companies.push(company);
        }

        const mappedCompanies = companies.map((company) => ({
            symbol: company.symbol,
            shortName: company.shortName,
            price: company.price,
            currency: company.currency,
            source: company.source
        }))

        ctx.body = {
            stocks: mappedCompanies,
            stocks_id: stock.stocks_id,
            datetime: stock.datetime
        };

        console.log('[API] Stock created', ctx.body)
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('stock.show', '/all', async (ctx) => {
    try {
        const page = parseInt(ctx.query.page) || defaultPage;
        const size = parseInt(ctx.query.size) || defaultSize;

        const startIndex = getStartIndex(page, size);

        const stocks = await ctx.orm.Stock.findAll({
            offset: startIndex,
            limit: size,
        });

        ctx.body = stocks;
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