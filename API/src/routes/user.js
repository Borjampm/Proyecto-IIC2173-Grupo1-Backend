const Router = require('koa-router');
const { Op } = require('sequelize');
const { consoleError, generalError, stock404 } = require('../parameters/errors.js');

const router = new Router();

// Post para crear un usuario
// Falta agregar las validaciones correspondientes
router.post('/signup', async (ctx) => {
    try {
        console.log(ctx.request.body, "bodybody body")
        const user = await ctx.orm.User.create(ctx.request.body);
        ctx.body = user;
    } catch (error) {
        console.log(error)
        ctx.body = generalError;
        ctx.status = 400;
    }
});

// Post para agregar dinero a la billetera
router.post('/addfunds', async (ctx) => {
    try {
        console.log(ctx.request.body, "bodybody body")
        const user = await ctx.orm.User.findOne({ where: { Username: ctx.request.body.Username } });
        if (user) {
            user.Wallet = parseFloat(user.Wallet) + parseFloat(ctx.request.body.Funds);
            // user.Wallet += parseFloat(ctx.request.body.Funds);
            await user.save();
            ctx.body = user;
        }
    }
    catch (error) {
        console.log(error, "error")
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('user.finInfo', '/:username', async (ctx) => {
    try {

        const user = await ctx.orm.User.findOne({
            where: {
              Username: {
                [Op.iLike]: `%${ctx.params.username}%`
              }
            }
          });

        ctx.body = {
            stocks_data: user
        }
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});





module.exports = router;
