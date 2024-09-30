const { v4: uuidv4 } = require('uuid');

class Comment {
    constructor(customer, factory, text, rating) {
      this.id = uuid();
      this.customer = customer;  // Customer who left the comment
      this.factory = factory;    // Factory to which the comment refers
      this.text = text;          // Text of the comment
      this.rating = rating;      // Rating of the factory (on a scale from 1 to 5)
      this.approved = false;
      this.deleted = false;
    }
  }
  
  module.exports = Comment;