require('newrelic');
const app = require('./app');
const connectToBroker = require('./broker/connection');

// eslint-disable-next-line no-undef
const PORT = process.env.PORT_LISTENER;

let isConnectedToBroker = false;

app.listen(PORT, () => {
  console.log(`[LISTENER] Listening on port ${PORT}`);

  if (!isConnectedToBroker) {
    connectToBroker();
    isConnectedToBroker = true;
  }
});