const Router = require('koa-router');
const axios = require('axios');

unfinished = "UNFINISHED";
finished = "FINISHED";
error = "ERROR";

const router = new Router();

const WORKERS_URL = process.env.WORKERS_URL;

router.post('predictions.create', '/', async (ctx) => {
    console.log("HOLAAAAAAAA")
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
        let message = null;
        const prediction = await ctx.orm.Prediction.create({
            user_id: id_user,
            job_id: job_id,
            state: unfinished,
            value: null,
            days_back: days_back,
            symbol: symbol,
            quantity: quantity,
            datetiem: fechaISO
        });
        axios
            .get(`${WORKERS_URL}temp/${days_back}/${symbol}/${quantity}`)
            .then(async (res) => {
                console.log('[API] Prediction posted in Workers')
                console.log(res.data)
                job_id = res.data.job_id
                prediction.job_id = job_id
                await prediction.save()
                message = {message: 'working'};
            })
            .catch((error) => {
                console.log("EEEEEE", error)
                // throw new Error('[API] Error posting prediction in Workers')
                message = {message: 'error'};
            })
        ctx.body = message;
        ctx.status = 201;
    } catch (err) {
        console.error(err);
    }
});


router.post('predictions.new', '/new', async (ctx) => {
    console.log("NEWW")
    try {

        console.log("[API] Starting new POST /predictions/")

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
            state: unfinished,
            value: null,
            days_back: days_back,
            symbol: symbol,
            quantity: quantity,
            datetiem: fechaISO
        });

        ctx.body = prediction;
        ctx.status = 201;
    } catch (err) {
        console.error(err);
    }
});

router.patch('predictions.new', '/edit', async (ctx) => {
    console.log("NEWW")
    try {

        const body = ctx.request.body;

        const pid = body.predictionid;
        const job_id = body.job_id;
        const value = body.value;

        const prediction = await ctx.orm.Prediction.findOne({
            where: {
                id: pid
            }
        });
        prediction.state = "FINISHED"
        prediction.value = value
        prediction.value = value

        ctx.body = prediction;
        ctx.status = 200;
    } catch (err) {
        console.error(err);
    }
});


module.exports = router;
