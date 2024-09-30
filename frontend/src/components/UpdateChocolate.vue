<template>
    <div class="update-chocolate">
      <h1>Update Chocolate</h1>
      <form @submit.prevent="updateChocolate">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="chocolate.name" required />
        </div>
        <div class="form-group">
          <label for="price">Price:</label>
          <input type="number" id="price" v-model="chocolate.price" required />
        </div>
        <div class="form-group">
          <label for="type">Type:</label>
          <input type="text" id="type" v-model="chocolate.type" required />
        </div>
        <div class="form-group">
          <label for="kind">Kind:</label>
          <input type="text" id="kind" v-model="chocolate.kind" required />
        </div>
        <div class="form-group">
          <label for="weight">Weight:</label>
          <input type="text" id="weight" v-model="chocolate.weight" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="chocolate.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" v-model="chocolate.quantity" required />
        </div>
        <button type="submit" class="btn btn-primary">Update Chocolate</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UpdateChocolate',
    data() {
      return {
        chocolate: {
          name: '',
          price: '',
          type: '',
          kind: '',
          weight: '',
          description: '',
          quantity: '',
        }
      };
    },
    mounted() {
      this.fetchChocolateDetails();
    },
    methods: {
      async fetchChocolateDetails() {
        const chocolateId = this.$route.params.id;
        try {
          const response = await axios.get(`http://localhost:3000/api/chocolates/${chocolateId}`);
          this.chocolate = response.data;
        } catch (error) {
          console.error('Error fetching chocolate details:', error);
        }
      },
      async updateChocolate() {
        const chocolateId = this.$route.params.id;
        try {
          await axios.put(`http://localhost:3000/api/chocolates/${chocolateId}`, this.chocolate);
          this.$router.push(`/chocolate/${chocolateId}`);
        } catch (error) {
          console.error('Error updating chocolate:', error);
          alert('There was an error updating the chocolate. Please try again.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .update-chocolate {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: black;
  }
  
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn:hover {
    background: #0056b3;
  }
  </style>
  