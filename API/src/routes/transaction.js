const Router = require('koa-router');
const { consoleError, generalError, stock404 } = require('../parameters/errors.js');

const router = new Router();

// Post para crear una órden de compra
router.post('/buy', async (ctx) => {
    try {
        const request = ctx.request.body;
        const user = await ctx.orm.User.findOne({
            where: {
                Username: request.Username
            }
        });
        const company = await ctx.orm.Company.findOne({
            where: {
                symbol: request.Symbol
            }
        });
        const TotalAmount = request.Price * request.Quantity;
        if (user.Wallet < TotalAmount) {
            ctx.body = {
                message: "You don't have enough money to buy this stock"
            };
            ctx.status = 400;
            return;
        } else {
            user.Wallet -= TotalAmount;
            await user.save();
        }
        const transaction = await ctx.orm.Transaction.create({
            Username: user.Username,
            CompanyId: company.id,
            Price: request.Price,
            Currency: request.Currency,
            TotalAmount: TotalAmount,
            Quantity: request.Quantity,
            Date: new Date().toISOString(),
            Completed: false,
            ipAdress: request.ipAdress,
            UserId: 1

        });
        ctx.body = transaction;
    } catch (error) {
        console.log(error)
        ctx.body = error;
        ctx.status = 400;
    }
});

// Post para actualizar una órden de compra
router.post('/validate', async (ctx) => {
    try {
        const request = ctx.request.body;
        const transaction = await ctx.orm.Transaction.findOne({
            where: {
                id: request.request_id
            }
        });
        if (request.valid) {
            transaction.Completed = true;
        } else {
            transaction.Completed = false;}
        await transaction.save();
        ctx.body = transaction;
    } catch (error) {
        ctx.body = error;
        ctx.status = 400;
    }
});











module.exports = router;
