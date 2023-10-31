const Router = require('koa-router');
const axios = require('axios');
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

const router = new Router();

const videoQueue = new Queue("audio transcoding", {
    connection: {
      host: "redis",
      port: 6379,
      password: 1029,
    },
  }); 

router.post("/addTask", async (ctx) => {
    try {
        console.log("[API] Starting POST /predictions/")

        const body = ctx.request.body;

        const days_back = body.DaysBack;
        const symbol = body.Symbol;
        const quantity = body.Quantity;
        const id_user = body.Id;

        const fechaActual = new Date();
        const fechaISO = fechaActual.toISOString();

        let job_id = null;
        let prediction = null;
        prediction = await ctx.orm.Prediction.create({
            user_id: id_user,
            job_id: job_id,
            state: "UNFINISHED",
            value: null,
            days_back: days_back,
            symbol: symbol,
            quantity: quantity,
            datetiem: fechaISO
        });
        const data = {
            user_id: id_user,
            job_id: job_id,
            state: "UNFINISHED",
            value: null,
            days_back: days_back,
            symbol: symbol,
            quantity: quantity,
            datetiem: fechaISO
        }
        console.log(ctx, "BODY BODY")
        videoQueue.add("video", `http://example.com/video${2 }.mov`); // video es el nombre del trabajo
        console.log(`Adding Task ${1}`);
        ctx.status = 200;
        ctx.body = { body:  "Acomplished" };
    } catch (error) {
        console.log(error, "sending error")
    }
});




module.exports = router;