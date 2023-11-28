require('newrelic');
const app = require('./app');
const db = require('./sequelize/models');

// eslint-disable-next-line no-undef
const PORT = process.env.PORT_API;

db.sequelize
 .authenticate()
 .then(() => {
   console.log('[API] Connection to the database has been established successfully.');
   app.listen(PORT, (err) => {
     if (err) {
       return console.error('Failed', err);
     }
     console.log(`[API] Listening on port ${PORT}`);
     return app;
   });
 })
 .catch((err) => console.error('[API] Unable to connect to the database:', err));