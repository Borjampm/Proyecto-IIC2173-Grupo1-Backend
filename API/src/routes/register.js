const Router = require('koa-router');

const router = new Router();

router.post('register.create', '/new', async (ctx) => {
    const request = ctx.request.body;

    const register = await ctx.orm.Register.create({
        request_id = request.request_id,
        group_id = parseInt(request.group_id),
        symbol = request.symbol,
        datetime = request.datetime,
        quantity = parseInt(request.quantity),
        valid = false
    });

    console.log('[API] Register created', ctx.body)
    ctx.body = register;
    ctx.status = 201;
})

router.patch('register.update', '/:id/:valid', async (ctx) => {
    const request_id = ctx.params.id;
    const valid = ctx.params.valid;

    const register = await ctx.orm.Register.findOne({
        where: {
            request_id
        }
    });

    if (!register) {
        console.log("[API] >>> Register not found", request_id)
        ctx.status = 404;
        ctx.body = {
            error: "Register not found"
        }
        return;
    }

    console.log("[API] Register updating", request_id);

    if (valid == 'true' || valid == 'True' || valid == 'TRUE' || valid == '1' || valid == 1 || valid == true) {
        register.valid = true;
        console.log("[API] Register status is valid", request_id, true)
    } else {
        register.valid = false;
        console.log("[API] Register status is invalid", request_id, false)
    }

    await register.save();

    ctx.body = register;
    ctx.status = 200;
});


router.get('register.show', '/:symbol', async (ctx) => {
    const symbol = ctx.params.symbol;

    const registers = await ctx.orm.Register.findAll({
        where: {
            symbol
        }
    });

    ctx.body = registers;
    ctx.status = 200;
});

module.exports = router;