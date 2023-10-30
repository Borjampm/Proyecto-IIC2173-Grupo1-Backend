const Router = require('koa-router');
const axios = require('axios');

unfinished = "UNFINISHED";
finished = "FINISHED";
error = "ERROR";

const router = new Router();

const WORKERS_URL = process.env.WORKERS_URL;

router.post('predictions.create', '/', async (ctx) => {
    try {
        console.log("[API] Starting POST /predictions/")

        const body = ctx.request.body;

        const days_back = body.DaysBack;
        const symbol = body.Symbol;
        const quantity = body.Quantity;
        const id_user = body.Id;

        const fechaActual = new Date();
        const fechaISO = fechaActual.toISOString();

        let job_id = NULL;

        axios
            .get(`${WORKERS_URL}/temp/${days_back}/${symbol}/${quantity}`)
            .then((res) => {
                console.log('[API] Prediction posted in Workers')
                job_id = res.data.job_id
            })
            .catch((error) => {
                throw new Error('[API] Error posting prediction in Workers', error)
            })

        if (job_id == NULL) {
            throw new Error('Error posting prediction in Workers')
        } else {
            const prediction = await ctx.orm.Prediction.create({
                user_id: id_user,
                job_id: job_id,
                state: unfinished,
                value: NULL,
                days_back: days_back,
                symbol: symbol,
                quantity: quantity,
                datetiem: fechaISO
            });

            console.log("[API] Prediction created")
            ctx.body = prediction;
            ctx.status = 201;
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;