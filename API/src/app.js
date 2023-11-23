const Koa = require("koa");
const koaLogger = require("koa-logger");
const { koaBody } =  require("koa-body");
const cors = require("@koa/cors");
const orm = require("./sequelize/models");
const router = require("./routes.js");

const app = new Koa();
app.use(cors({
    origin: '*',
    methods: '*',
    allowHeaders: '*',
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
