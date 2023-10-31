const { Queue } = require("bullmq");

const videoQueue = new Queue("audio transcoding", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
}); // Specify Redis connection using object

const seconds = 2 * 1000;
let i = 0;

setInterval(() => {
  videoQueue.add("video", `http://example.com/video${i}.mov`); // video es el nombre del trabajo
  console.log(`Adding Task ${i}`);
  i++;
}, seconds);
