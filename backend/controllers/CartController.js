const CartService = require('../Services/CartService');

exports.getCartById = async (req, res) => {
  try {
    const cart = await CartService.getCartById(req.params.cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart', error });
  }
};

exports.createCart = async (req, res) => {
  try {
    const { user } = req.body;
    const newCart = await CartService.createCart(user);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cart', error });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { chocolate, quantity } = req.body;
    const updatedCart = await CartService.addItemToCart(cartId, chocolate, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { cartId, chocolateId } = req.params;
    const updatedCart = await CartService.removeItemFromCart(cartId, chocolateId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};