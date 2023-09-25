const koa = require("koa");
const koaLogger = require("koa-logger");
const { koaBody } =  require("koa-body");
const orm = require("./sequelize/models");
const router = require("./routes.js");
const cors = require("@koa/cors");

const FRONT_URL = process.env.FRONT_URL;

const app = new koa();
app.use(cors({
    origin: FRONT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  }));

app.context.orm = orm;

app.use(koaLogger());
app.use(koaBody());
app.use(router.routes());

// eslint-disable-next-line no-unused-vars
app.use((ctx, next) => {
    ctx.body = "[404] The route does not exist";
    ctx.response.status = 404;
})

module.exports = app;