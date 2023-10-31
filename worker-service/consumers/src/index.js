const { Worker, Job } = require("bullmq");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const queueMQ = new Queue("audio transcoding", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
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

/**
 *
 * @param {Job} job
 */
async function processor(job) { 
  // Optionally report some progress
  await sleep(2000);
  await job.updateProgress(42);   // Se puede actualizar el progreso, que el Broker puede obtener esto para saber en que porciento está y le sirve al visualizador

  // Optionally sending an object as progress
  await job.updateProgress({ foo: "bar" });

  // Do something with job
  if (Math.random() <= 0.3) {
    // To give a posibility to the job to fail and handle that job fail
    throw Error("The Audio could not be decoded");
  }
  return "Audio decodified";
}

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
};

const worker = new Worker("audio transcoding", processor, {
  autorun: false,
  connection,
}); // Specify Redis connection using object

console.log("Worker Listening to Jobs...");

// Callback on completed jobs
worker.on("completed", (job, returnvalue) => {

  console.log(`Worker completed job ${job.id} with result ${returnvalue}`);
});

// Callback on failed jobs
worker.on("failed", (job, error) => {
  console.log(`Worker completed job ${job.id} with error ${error}`);
  // Do something with the return value.
});

// Callback on error of the worker
worker.on("error", (err) => {
  // log the error
  console.error(err);
});

worker.run();

// To handle gracefull shutdown of consummers
async function shutdown() {
  console.log("Received SIGTERM signal. Gracefully shutting down...");

  // Perform cleanup or shutdown operations here
  await worker.close();
  // Once cleanup is complete, exit the process
  process.exit(0);
}
process.on("SIGTERM", shutdown); // Este método hace que se baje el container cuando el proceso termine, para que no queden tareas a medias
process.on("SIGINT", shutdown);


