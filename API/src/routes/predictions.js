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