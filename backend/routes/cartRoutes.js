const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

router.get('/:cartId', cartController.getCartById);
router.post('/', cartController.createCart);
router.post('/:cartId/items', cartController.addItemToCart);
router.delete('/:cartId/items/:chocolateId', cartController.removeItemFromCart);

module.exports = router;