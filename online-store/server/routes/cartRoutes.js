const Router = require('express');
const router = new Router();
const cartController = require('../controllers/CartController');

router.post('/cart', cartController.addToCart);
router.get('/cart', cartController.getCart);
router.delete('/cart/:productId', cartController.removeFromCart);

module.exports = router;
