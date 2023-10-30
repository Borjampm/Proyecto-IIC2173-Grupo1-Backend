const Router = require('koa-router');
const { consoleError, generalError } = require('../parameters/errors.js');

const router = new Router();

router.post('register.create', '/new', async (ctx) => {
    try {
        const request = ctx.request.body;

        const register = await ctx.orm.Register.create({
            request_id: request.request_id,
            group_id: parseInt(request.group_id),
            symbol: request.symbol,
            datetime: request.datetime,
            quantity: parseInt(request.quantity),
            valid: false
        });

        console.log('[API] Register created', ctx.body)
        ctx.body = register;
        ctx.status = 201;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
})

router.patch('register.update', '/:id/:valid', async (ctx) => {
    try {
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
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});


router.get('register.show', '/:symbol', async (ctx) => {
    try {
        const symbol = ctx.params.symbol;

        const registers = await ctx.orm.Register.findAll({
            where: {
                symbol
            }
        });

        ctx.body = registers;
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

router.get('register.weighter', '/:symbol/:day', async (ctx) => {
    try {
        const symbol = ctx.params.symbol;
        const datetime = ctx.params.datetime;
        const date = datetime.split('T')[0]

        const registers = await ctx.orm.Register.findAll({
            where: {
                symbol: symbol,
                datetime: {
                    [Op.like]: `${date}%`
                },
                valid: true
            },
        });

        ctx.body = {
            transactions: registers.length
        };
        ctx.status = 200;
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;