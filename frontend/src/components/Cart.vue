<template>
  <div class="cart">
    <h1>Your Cart</h1>
    <div v-if="cart.length > 0">
      <div class="cart-item" v-for="item in cart" :key="item.chocolate.id">
        <img :src="item.chocolate.image" alt="Chocolate Image" class="cart-item-image">
        <div class="cart-item-info">
          <h3>{{ item.chocolate.name }}</h3>
          <p>{{ item.chocolate.type }}, {{ item.chocolate.kind }}</p>
          <p>{{ item.chocolate.price }}$</p>
          <div class="quantity-controls">
            <button @click="updateQuantity(item, -1)">-</button>
            <input type="number" v-model="item.quantity" @input="updateQuantity(item, 0)">
            <button @click="updateQuantity(item, 1)">+</button>
          </div>
          <button class="remove-button" @click="removeFromCart(item.chocolate.id)">Remove</button>
        </div>
      </div>
      <div class="cart-total">
        <h2>Total: {{ totalPrice }}$</h2>
        <button class="checkout-button" @click="checkout">Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Your cart is empty.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      user: null,
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.chocolate.price * item.quantity, 0).toFixed(2);
    }
  },
  watch: {
    cart: {
      handler(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
      },
      deep: true
    }
  },
  async created() {
    await this.fetchUserDetails();
  },
  methods: {
    updateQuantity(item, change) {
      item.quantity += change;
      if (item.quantity < 1) item.quantity = 1;
      if (item.quantity > item.chocolate.quantity) item.quantity = item.chocolate.quantity;
    },
    removeFromCart(chocolateId) {
      this.cart = this.cart.filter(item => item.chocolate.id !== chocolateId);
    },
    async fetchUserDetails() {
      try {
        const userId = localStorage.getItem('id'); // assuming userId is stored in localStorage
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('There was an error fetching user details. Please try again.');
      }
    },
    async fetchFactoryDetails(item) {
      try {
        const response = await axios.get(`http://localhost:3000/api/factories/${item.factoryId}`);
        item.chocolate.factory = response.data;
      } catch (error) {
        console.error('Error fetching factory details:', error);
        alert('There was an error fetching factory details. Please try again.');
      }
    },
    async checkout() {
      console.log('Checkout button clicked');
      if (this.cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      for (const item of this.cart) {
        if (!item.chocolate.factory) {
          await this.fetchFactoryDetails(item);
        }
      }

      const newPurchase = {
        chocolates: this.cart.map(item => ({
          id: item.chocolate.id,
          name: item.chocolate.name,
          price: item.chocolate.price,
          type: item.chocolate.type,
          kind: item.chocolate.kind,
          weight: item.chocolate.weight,
          description: item.chocolate.description,
          image: item.chocolate.image,
          quantity: item.quantity,
          status: item.chocolate.status
        })),
        factory: {
          id: this.cart[0].chocolate.factory.id,
          name: this.cart[0].chocolate.factory.name
        },
        dateTime: new Date().toISOString(),
        price: this.cart.reduce((total, item) => total + (item.chocolate.price * item.quantity), 0),
        customer: localStorage.getItem('id'), // or however you get the customer ID
        status: 'Obrada',
        deleted: false
      };

      console.log('New purchase data:', newPurchase);

      try {
        const response = await axios.post('http://localhost:3000/api/purchases', newPurchase);
        console.log('API response:', response);
        
        for (const item of this.cart) {
          await this.updateFactoryChocolateQuantity(item.chocolate.factory.id, item.chocolate.id, item.quantity);
        }

        // Calculate the points and update the user
        const pointsEarned = Math.floor(newPurchase.price / 1000 * 133);
        await this.updateUserPoints(pointsEarned);

        localStorage.removeItem('cart');
        alert('Purchase completed successfully.');
        this.cart = []; // clear the cart after successful checkout
      } catch (error) {
        console.error('Error creating purchase:', error);
        alert('There was an error processing your purchase. Please try again.');
      }
    },
    async updateUserPoints(points) {
      try {
        const updatedUser = { ...this.user, points: this.user.points + points };
        const response = await axios.put(`http://localhost:3000/api/users/${this.user.id}`, updatedUser);
        this.user = response.data;
      } catch (error) {
        console.error('Error updating user points:', error);
        alert('There was an error updating user points. Please try again.');
      }
    },
    async updateFactoryChocolateQuantity(factoryId, chocolateId, quantityPurchased) {
      try {
        // Fetch factory details
        const factoryResponse = await axios.get(`http://localhost:3000/api/factories/${factoryId}`);
        const factory = factoryResponse.data;

        // Find the chocolate in the factory's chocolates array
        const chocolate = factory.chocolates.find(choco => choco.id === chocolateId);
        if (chocolate) {
          // Update chocolate quantity
          chocolate.quantity -= quantityPurchased;
          if (chocolate.quantity < 0) chocolate.quantity = 0;

          // Update the factory in the backend
          await axios.put(`http://localhost:3000/api/factories/${factory.id}`, factory);
        } else {
          console.error('Chocolate not found in factory.');
          alert('Chocolate not found in factory. Please try again.');
        }
      } catch (error) {
        console.error('Error updating factory chocolate quantity:', error);
        alert('There was an error updating factory chocolate quantity. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.cart {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.cart h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.cart-item:hover {
  transform: scale(1.02);
}

.cart-item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  margin-right: 20px;
  object-fit: cover;
}

.cart-item-info {
  flex-grow: 1;
}

.cart-item-info h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.cart-item-info p {
  font-size: 1rem;
  margin: 5px 0;
  color: #555;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}

.quantity-controls button:hover {
  background-color: #0056b3;
}

.quantity-controls input {
  width: 60px;
  height: 30px;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-button {
  display: inline-block;
  margin-top: 10px;
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

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #ddd;
  margin-top: 20px;
}

.cart-total h2 {
  font-size: 1.5rem;
  color: #333;
}

.checkout-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1.2rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.checkout-button:hover {
  background-color: #218838;
}

.cart p {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}
</style>
