const Router = require('koa-router');
const axios = require('axios');

const router = new Router();


router.post("/addTask", async (ctx) => {
    try {
        ctx.status = 200;
        ctx.body = { body:  "Acomplished" };
    } catch (error) {
        console.log(error, "sending error")
    }
});




module.exports = router;