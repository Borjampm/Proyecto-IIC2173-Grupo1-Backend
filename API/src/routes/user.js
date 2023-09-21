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



module.exports = router;
