const Router = require('koa-router');
const axios = require('axios');
const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');

unfinished = "UNFINISHED";
finished = "FINISHED";
error = "ERROR";

const redisConnectionOptions = {
    host: process.env.REDIS_HOST || 'redis', // Use the environment variable or default to 'redis' (your service name in Docker Compose)
    port: process.env.REDIS_PORT || 6379,    // Use the environment variable or default to 6379
    password: 1029,    // Optional, use if you have a Redis password
  };

const queue = new Queue('audio transcoding', {
    connection: new IORedis(redisConnectionOptions),
});

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
        let prediction = null;

            prediction = await ctx.orm.Prediction.create({
                user_id: "id_user",
                job_id: "job_id",
                state: "f",
                value: "fff",
                days_back: 2,
                symbol: 2,
                quantity: 2,
                datetiem: fechaISO
            });

            console.log("[API] Prediction created")
            // Example: Send a task to the queue
            queue.add('audio', 'http://example.com/audio1.mp3');

            // Example: Set up a BullMQ worker
            const worker = new Worker('audio transcoding', async job => {
            // Your task processing logic here
            console.log(`Processing job: ${job.id}`);
            });

        ctx.body = prediction;
        ctx.status = 201;
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;