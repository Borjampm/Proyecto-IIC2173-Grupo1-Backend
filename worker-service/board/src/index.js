const express = require("express");
const { Queue } = require("bullmq");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const queueMQ = new Queue("audio transcoding", {
  connection: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
}); // Specify Redis connection using object);

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(queueMQ)],
  serverAdapter: serverAdapter,
});

const app = express();

app.post("/admin/addTask", (req, res) => {
  try {
    // Access the data from the request body
    const taskData = req.body;
    console.log(taskData)

    // You can perform any processing or validation of the data here

    // For example, you can add the task data to your queue
    // Replace this with your actual queue logic
    // Example: queueMQ.add("audio_transcoding", taskData);

    res.status(200).json({ message: "Task added successfully", data: taskData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add the task" });
  }
});

app.use("/admin/queues", serverAdapter.getRouter());

// other configurations of your server

app.listen(3000, () => {
  console.log("Running Bull Board on 3000...");
  console.log("For the UI, open http://localhost:3000/admin/queues");
  console.log("Make sure Redis is running on port 6379 by default");
});
