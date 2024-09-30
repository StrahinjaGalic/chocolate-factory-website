<template>
    <div class="update-factory">
      <h1>Update Factory</h1>
      <form @submit.prevent="updateFactory">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="factory.name" required />
        </div>
        <div class="form-group">
          <label for="location">Location:</label>
          <input type="text" id="location" v-model="factory.locationId" required />
        </div>
        <div class="form-group">
          <label for="workingHours">Working Hours:</label>
          <input type="text" id="workingHours" v-model="factory.workingHours" required />
        </div>
        <div class="form-group">
          <label for="status">Status:</label>
          <input type="text" id="status" v-model="factory.status" required />
        </div>
        <div class="form-group">
          <label for="rating">Rating:</label>
          <input type="number" id="rating" v-model="factory.rating" required />
        </div>
        <button type="submit" class="btn btn-primary">Update Factory</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UpdateFactory',
    data() {
      return {
        factory: {
          id: '',
          name: '',
          chocolates: [],
          workingHours: '',
          status: '',
          locationId: '',
          logo: '',
          rating: ''
        },
        locationName: ''
      };
    },
    mounted() {
      this.fetchFactoryDetails();
    },
    methods: {
      async fetchFactoryDetails() {
        const factoryId = this.$route.params.id;
        try {
          const response = await axios.get(`http://localhost:3000/api/factories/${factoryId}`);
          this.factory = response.data;
          await this.fetchLocationName(this.factory.locationId);
        } catch (error) {
          console.error('Error fetching factory details:', error);
        }
      },
      async fetchLocationName(locationId) {
        try {
          const response = await axios.get(`http://localhost:3000/api/locations/${locationId}`);
          this.locationName = response.data.address;
        } catch (error) {
          console.error('Error fetching location name:', error);
        }
      },
      async updateFactory() {
        const factoryId = this.$route.params.id;
        try {
          await axios.put(`http://localhost:3000/api/factories/${factoryId}`, this.factory);
          this.$router.push(`/factory/${factoryId}`);
        } catch (error) {
          console.error('Error updating factory:', error);
          alert('There was an error updating the factory. Please try again.');
        }
      },
      async updateLocationId() {
        try {
          const response = await axios.get(`http://localhost:3000/api/locations?name=${this.locationName}`);
          if (response.data.length > 0) {
            this.factory.locationId = response.data[0].id;
          } else {
            this.factory.locationId = '';
          }
        } catch (error) {
          console.error('Error updating location ID:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .update-factory {
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
    color: black; /* Changed color to black */
  }
  
  .form-group input {
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