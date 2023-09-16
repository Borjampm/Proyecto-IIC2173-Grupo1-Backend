const Router = require('koa-router');
const Stocks = require('./routes/stock');
const Companies = require('./routes/company');

const router = new Router();

router.use('/stocks', Stocks.routes());
router.use('/companies', Companies.routes());

module.exports = router;