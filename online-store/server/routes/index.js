const Router = require('express');
const router = new Router();
const petProductRouter = require('./petRouter');
const userRouter = require('./userRouter');
const categoryRouter = require('./categoryRouter');
const typeRouter = require('./typeRouter');
const orderRouter = require('./orderRoutes');

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/category', categoryRouter);
router.use('/orders', orderRouter);
router.use('/petProduct', petProductRouter);
module.exports = router;
