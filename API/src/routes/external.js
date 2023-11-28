const Router = require('koa-router');
const { consoleError, generalError } = require('../parameters/errors.js');

const router = new Router();
router.get('company.show', '/', async (ctx) => {
    try {
        console.log("Hello")
        ctx.body = "Hello"
    } catch (error) {
        console.error(consoleError, error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});

module.exports = router;
