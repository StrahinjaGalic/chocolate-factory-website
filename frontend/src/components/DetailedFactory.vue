<template>
  <div class="factory-details">
    <h1>Factory Details</h1>
    <div v-if="factory != null">
      <div class="card">
        <div class="card-body">
          <div class="card-content">
          
              <div class="card-text-content">
              <h2 class="card-title">{{ factory.name }}</h2>
              <p class="card-text"><strong>Location:</strong> {{ factory.location?.address || 'Loading...' }}</p>
              <p class="card-text"><strong>Working Hours:</strong> {{ factory.workingHours }}</p>
              <p class="card-text"><strong>Status:</strong> {{ factory.status }}</p>
              <p class="card-text"><strong>Rating:</strong> {{ factory.rating }}</p>
              </div>
              <img :src="factory.logo" alt="Factory Logo" class="factory-logo" />
            
            
          </div>
          <p class="card-text"><strong>Chocolates:</strong></p>
          <div class="chocolates-container">
            <div class="chocolate-card" v-for="chocolate in chocolates" :key="chocolate.id">
              <img :src="chocolate.image" alt="Chocolate Image" class="chocolate-image">
              <div class="chocolate-info">
                <h3>{{ chocolate.name }}</h3>
                <p>{{ chocolate.type }}, {{ chocolate.kind }}</p>
                <p>{{ chocolate.price }}$</p>
                <p>Quantity: {{ chocolate.quantity }}</p>
                <div v-if="role === 'customer'" class="add-to-cart">
                  <input type="number" v-model.number="chocolate.quantityToAdd" :max="chocolate.quantity" min="1" @input="validateQuantity(chocolate)">
                  <button class="add-to-cart-button" @click="addToCart(chocolate)">Add to Cart</button>
                </div>
                <div class="chocolate-actions" v-if="this.customerFactory === this.$route.params.id && role === 'manager' || role === 'admin' ">
                  <button class="remove-button" @click="removeChocolate(chocolate.id)">Remove</button>
                  <router-link :to="`/chocolate/${chocolate.id}/update`" class="update-button">Update</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="comments-section">
        <h2>Comments for {{ factory.name }}</h2>
        <div v-if="comments.length > 0">
          <div class="comment-card" v-for="comment in filteredComments" :key="comment.id">
            <p class="comment-text">{{ comment.text }}</p>
            <div class="comment-rating">
              <strong>Rating:</strong>
              <span v-for="n in comment.rating" :key="n" class="star">★</span>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="no-comments">No comments for this factory.</p>
        </div>
      </div>
      <div class="actions" v-if="this.customerFactory === this.$route.params.id && role === 'manager' || role === 'admin'">
        <router-link :to="`/factory/${factory.id}/add-chocolate`" class="add-button">Add Chocolate</router-link>
        <router-link :to="`/factory/${factory.id}/update`" class="update-factory-button">Update Factory</router-link>
      </div>
      <div class="comment-entry" v-if="customerHasPurchase">
        <h3>Add a Comment</h3>
        <div class="comment-input">
          <input type="number" v-model.number="commentRating" min="1" max="5" placeholder="Rating (1-5)">
          <textarea v-model="commentText" placeholder="Enter your comment"></textarea>
        </div>
        <button @click="postComment" class="post-comment-button">Post Comment</button>
      </div>
    </div>
    <div v-else>
      <h2>You don't have an assigned factory yet...</h2>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      factory: null,
      chocolates: [],
      comments: [],
      role: localStorage.getItem('role'),
      customerId: localStorage.getItem('id'),
      customerFactory : localStorage.getItem('factoryId'),
      customerHasPurchase: false,
      customerPurchases: [],
      commentText: '',
      commentRating: 1
    };
  },
  mounted() {
    this.fetchPurchase(); 
    this.fetchFactoryDetails()
  
    
  console.log('Customer ID:', this.customerId);
  console.log('Customer Purchases:', this.customerPurchases);
  console.log('Customer Has Purchase:', this.customerHasPurchase);
  
  
  },
  computed: {
    filteredComments() {

      this.comments = this.comments.filter(comment => comment.factory === this.factory.id && comment.deleted === false);
      if (this.role === 'admin' || this.role === 'manager') {
        return this.comments;
      } else {
        return this.comments.filter(comment => comment.approved === true);
      }
    },
    customerHasPurchase() {
      return this.customerPurchases.length > 0;
    }
  },
  methods: {
    async postComment() {
      const customerId = localStorage.getItem('id');
      const factoryId = this.factory.id;
      const comment = {
        text: this.commentText,
        rating: this.commentRating,
        customer: customerId,
        factory: factoryId,
        approved: false,
        deleted: false
      };

      try {
        await axios.post('http://localhost:3000/api/comments', comment);
        this.comments.push(comment);
        this.commentText = '';
        this.commentRating = 1;
        window.location.reload();

      } catch (error) {
        console.error('Error posting comment:', error);
        alert('There was an error posting your comment. Please try again.');
      }
    },
    async fetchFactoryDetails() {
      const factoryId = this.$route.params.id;
      try {
        const [factoryResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/factories/${factoryId}`),
          axios.get(`http://localhost:3000/api/comments`)
        ]);

        this.factory = factoryResponse.data;
        this.comments = commentsResponse.data;
        this.chocolates = this.factory.chocolates.map(chocolate => ({
          ...chocolate,
          quantityToAdd: 1
        }));

        
        
      } catch (error) {
        console.error('Error fetching factory details:', error);
        alert('Error loading factory details. Please try again later.');
      }
    },
    async fetchPurchase() {
      try {
        const response = await axios.get(`http://localhost:3000/api/purchases`);

        this.customerPurchases = response.data.filter(purchase => purchase.customer === this.customerId && purchase.factory.id === this.$route.params.id && purchase.deleted === false && purchase.status === 'Odobreno');
        this.customerHasPurchase = this.customerPurchases.length > 0;
        console.log('Customer Purchases:', this.customerHasPurchase);
        
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    },
    validateQuantity(chocolate) {
      if (chocolate.quantityToAdd > chocolate.quantity) {
        chocolate.quantityToAdd = chocolate.quantity;
      } else if (chocolate.quantityToAdd < 1) {
        chocolate.quantityToAdd = 1;
      }
    },
    addToCart(chocolate) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.chocolate.id === chocolate.id);

      // Check if there are chocolates from another factory in the cart
      const hasChocolatesFromOtherFactories = cart.some(item => item.factoryId !== this.factory.id);

      if (hasChocolatesFromOtherFactories) {
        // Prompt the user to confirm clearing the cart
        if (confirm('Adding chocolates from another factory will empty your current cart. Do you want to proceed?')) {
          // Clear the cart
          localStorage.removeItem('cart');
          cart.length = 0; // Empty the array

          // Add the new chocolate to the cart
          cart.push({
            chocolate: {
              id: chocolate.id,
              name: chocolate.name,
              price: chocolate.price,
              type: chocolate.type,
              kind: chocolate.kind,
              image: chocolate.image,
              quantity: chocolate.quantity
            },
            quantity: chocolate.quantityToAdd,
            factoryId: this.factory.id
          });

          localStorage.setItem('cart', JSON.stringify(cart));
          alert(`${chocolate.quantityToAdd} ${chocolate.name}(s) added to cart.`);
        } else {
          // User cancelled, do nothing
          return;
        }
      } else {
        // No chocolates from another factory in the cart, proceed as usual
        if (existingItem) {
          existingItem.quantity += chocolate.quantityToAdd;
          if (existingItem.quantity > chocolate.quantity) {
            existingItem.quantity = chocolate.quantity;
          }
        } else {
          cart.push({
            chocolate: {
              id: chocolate.id,
              name: chocolate.name,
              price: chocolate.price,
              type: chocolate.type,
              kind: chocolate.kind,
              image: chocolate.image,
              quantity: chocolate.quantity
            },
            quantity: chocolate.quantityToAdd,
            factoryId: this.factory.id
          });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${chocolate.quantityToAdd} ${chocolate.name}(s) added to cart.`);
      }
    },
    async removeChocolate(chocolateId) {
      try {
        await axios.delete(`http://localhost:3000/api/factories/${this.factory.id}/chocolates/${chocolateId}`);
        this.chocolates = this.chocolates.filter(chocolate => chocolate.id !== chocolateId);
      } catch (error) {
        console.error('Error removing chocolate:', error);
        alert('There was an error removing the chocolate. Please try again.');
      }
    }
  }
};
</script>



<style scoped>
body {
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
}

.factory-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #f0f0f0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
}

.card-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 15px;
}

.card-text {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #555;
}

.chocolates-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chocolate-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  width: calc(50% - 20px);
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.chocolate-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.chocolate-image {
  width: 120px;
  height: 120px;
  border-radius: 5px;
  margin-right: 20px;
  object-fit: cover;
}

.chocolate-info {
  flex-grow: 1;
}

.chocolate-info h3 {
  font-size: 1.5rem;
  margin-bottom: 5px;
  color: #333;
}

.chocolate-info p {
  font-size: 1rem;
  margin: 0;
  color: #555;
}

.add-to-cart {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.add-to-cart input {
  width: 60px;
  height: 30px;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.add-to-cart-button {
  padding: 8px 16px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-to-cart-button:hover {
  background-color: #0056b3;
}

.chocolate-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.remove-button {
  padding: 8px 16px;
  font-size: 1rem;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-button:hover {
  background-color: #c82333;
}

.update-button {
  padding: 8px 16px;
  font-size: 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
}

.update-button:hover {
  background-color: #218838;
}

.factory-logo {
  display: block;
  margin-left: auto;
  margin-right: 0;
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.comments-section {
  margin-top: 30px;
}

.card-text-content {
  flex: 1; /* Grow to fill remaining space */
}

.image-container {
  margin-left: 20px; /* Adjust margin as needed */
}

.comment-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center; /* Center items vertically */
}
.comment-text {
  font-size: 1rem;
  color: #555;
}

.comment-rating {
  font-size: 1rem;
  color: #f39c12;
  margin-top: 5px;
}

.star {
  margin-right: 2px;
}

.no-comments {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.add-button, .update-factory-button {
  padding: 12px 24px;
  font-size: 1.2rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.add-button:hover, .update-factory-button:hover {
  background-color: #0056b3;
}

.update-factory-button {
  background-color: #28a745;
}

.update-factory-button:hover {
  background-color: #218838;
}
.comment-entry {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-top: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
  visibility: visible;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.comment-input input,
.comment-input textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.comment-input input:focus,
.comment-input textarea:focus {
  border-color: #007bff;
  outline: none;
}

.post-comment-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post-comment-button:hover {
  background-color: #0056b3;
}

</style>
