const Router = require('koa-router');
const Stocks = require('./routes/stock');
const Companies = require('./routes/company');
const Users = require('./routes/user');
const Transactions = require('./routes/transaction');
const Register = require('./routes/register');
const Prediction = require('./routes/predictions');

const router = new Router();

router.use('/stocks', Stocks.routes());
router.use('/companies', Companies.routes());
router.use('/users', Users.routes());
router.use('/transactions', Transactions.routes());
router.use('/registers', Register.routes());
router.use('/predictions', Prediction.routes());

module.exports = router;