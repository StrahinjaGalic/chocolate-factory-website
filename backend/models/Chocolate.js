const { v4: uuidv4 } = require('uuid');

class Chocolate {
  constructor(name, price, type, kind, weight, description, image, quantity) {
    this.id = uuidv4(),  // Generates a unique identifier
    this.name = name;
    this.price = price;
    this.type = type;
    this.kind = kind;
    this.weight = weight;
    this.description = description;
    this.image = image;
    this.quantity = quantity;
     this.status = quantity > 0 ? 'Ima na stanju' : 'Nema na stanju';
     this.deleted = false;
 }

  // Method to change the quantity of chocolates
  changeQuantity(newQuantity) {
    this.quantity = newQuantity;
    this.status = newQuantity > 0 ? 'Ima na stanju' : 'Nema na stanju';
  }
}

module.exports = Chocolate;