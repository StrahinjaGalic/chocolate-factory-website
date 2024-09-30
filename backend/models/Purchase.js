const { v4: uuidv4 } = require('uuid');


class Purchase {
    constructor(chocolates, factory, dateTime, price, customer, status,deleted) {
      this.id = uuid();          // Unique identifier
      this.chocolates = chocolates;  // Array of chocolates that were purchased
      this.factory = factory;  // Factory from which the chocolates were purchased
      this.dateTime = dateTime; // Date and time of the purchase
      this.price = price;      // Total price of the purchase
      this.customer = customer;  // Customer who made the purchase
      this.status = status;    // Status of the purchase (Obrada, Odobreno, Odbijeno, Otkazano)
      this.deleted = deleted;
    }
  }
  
  module.exports = Purchase;