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

        let job_id = null;
        // let prediction = null;

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
            .get(`${WORKERS_URL}/temp/${days_back}/${symbol}/${quantity}`) 
            .then(async (res) => { 
                console.log('[API] Prediction posted in Workers') 
                console.log(res.data) 
                job_id = res.data.job_id 
                prediction.job_id = job_id 
                await prediction.save() 
                const message = {message: 'working'}; 
                ctx.body = message; 
                ctx.status = 201; 
            }) 
            .catch((error) => { 
                console.log("EEEEEE", error) 
                // throw new Error('[API] Error posting prediction in Workers') 
                const message = {message: 'error'}; 
                ctx.body = message; 
                ctx.status = 400; 
            }) 

    } catch (err) { 
        console.error(err); 
    }
});

router.get('userpredictions', '/:userid', async (ctx) => {
    try {
        // Obtener la parte de la fecha de la cadena ISO 8601

        const predictions = await ctx.orm.Prediction.findAll({
            where: {
                user_id: ctx.request.params.userid
            }
        });


        ctx.body = {
            predictions: predictions,
        };
        console.error("predictions yei", predictions);
        ctx.status = 200;
    } catch (error) {
        console.error("predictions bu", error);
        ctx.body = generalError;
        ctx.status = 400;
    }
});



module.exports = router;