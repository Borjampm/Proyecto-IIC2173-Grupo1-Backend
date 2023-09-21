const Router = require('koa-router');
const { consoleError, generalError, stock404 } = require('../parameters/errors.js');

const router = new Router();

// Post para crear un usuario
// Falta agregar las validaciones correspondientes
router.post('/signup', async (ctx) => {
    try {
        const user = await ctx.orm.User.create(ctx.request.body);
        ctx.body = user;
    } catch (error) {
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// Post para agregar dinero a la billetera
router.post('/addfunds', async (ctx) => {
    try {
        const user = await ctx.orm.User.findOne({ where: { Username: ctx.request.body.Username } });
        if (user) {
            user.Wallet += ctx.request.body.Funds;
            await user.save();
            ctx.body = user;
        }
    }
    catch (error) {
        ctx.body = generalError;
        ctx.status = 400;
    }
});





module.exports = router;
