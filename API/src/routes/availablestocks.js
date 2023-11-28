const Router = require('koa-router');
// const { Op } = require('sequelize');
const { consoleError, generalError } = require('../parameters/errors.js');
// const { defaultPage, defaultSize } = require('../parameters/request.js');
// const { getStartIndex } = require('../utils/request.js');

const router = new Router();

router.get('stock.available', '/all', async (ctx) => {
    try {
        const stocks = await ctx.orm.AvailableStock.findAll();

        // const stocksWithAmountZero = stocks.filter(stock => stock.amount === 0);
        const stocksWithNonZeroAmount = stocks.filter(stock => stock.amount !== 0);

        const data = [];
        const profit = 1.2;

        // console.log("====================================");
        // console.log("stocksWithNonZeroAmount", stocksWithNonZeroAmount);
        // console.log("====================================");

        for (const stockAvalible of stocksWithNonZeroAmount) {
            const stock = await ctx.orm.Stock.findOne({
                where: { stocksId: stockAvalible.stock_id },
            });
            // console.log("====================================");
            // console.log("stock", stock);
            // console.log("====================================");
            const companyId = await ctx.orm.CompanyStock.findOne({
                where: { stockId: stock.id },
            });
            // console.log("====================================");
            // console.log("companyId", companyId);
            // console.log("====================================");
            const companyData = await ctx.orm.Company.findOne({
                where: { id: companyId.companyId },
            });
            // console.log("====================================");
            // console.log("companyData", companyData);
            // console.log("====================================");
            const transaction = await ctx.orm.Transaction.findOne({
                where: { CompanyId: companyId.companyId },
                order: [['Date', 'DESC']],
            });
            // console.log("====================================");
            // console.log("transaction", transaction);
            // console.log("====================================");

            let price = (transaction.Price / transaction.Quantity) * profit;
            price = parseInt(price);

            const finalData = {
                stock_id: stockAvalible.stock_id,
                amount: stockAvalible.amount,
                price: price,
                company: companyId.companyId,
                company_name: companyData.shortName,
            }

            data.push(finalData);
        }

        ctx.body = data;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});



module.exports = router;
