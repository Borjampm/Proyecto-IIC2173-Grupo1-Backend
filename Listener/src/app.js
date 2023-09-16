const koa = require("koa");

const app = new koa();

// eslint-disable-next-line no-unused-vars
app.use((ctx, next) => {
    ctx.body = "[404] The route does not exist";
    ctx.response.status = 404;
})

module.exports = app;