const { v4: uuidv4 } = require('uuid');

class Cart {
  constructor(user) {
    this.id = uuidv4();      // Generates a unique identifier
    this.user = user;        // User object or userId
    this.items = [];         // Array of objects representing chocolates in the cart
    this.totalPrice = 0;     // Total price of chocolates in the cart
  }
}

module.exports = Cart;