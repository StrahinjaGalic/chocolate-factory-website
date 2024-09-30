<template>
    <div class="user-creation">
      <h1>Create New User</h1>
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="createUser">
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" v-model="user.username" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="user.password" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="user.name" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="surname">Surname:</label>
              <input type="text" id="surname" v-model="user.surname" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="gender">Gender:</label>
              <select id="gender" v-model="user.gender" class="form-control" required>
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth:</label>
              <input type="date" id="dateOfBirth" v-model="user.dateOfBirth" class="form-control" required />
            </div>
            <div class="form-group">
              <label for="role">Role:</label>
              <input type="text" id="role" v-model="user.role" class="form-control" readonly />
            </div>
            <div class="form-group">
              <label for="factory">Factory:</label>
              <input type="text" id="factory" v-model="factoryName" class="form-control" readonly />
            </div>
            <button type="submit" class="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {
          username: '',
          password: '',
          name: '',
          surname: '',
          gender: '',
          dateOfBirth: '',
          role: 'worker',
          purchases: [],
          cart: [],
          chocolateFactory: {
            id: '',
            name: ''
          },
          points: 0,
          customerType: {
            name: '',
            discountPercentage: 0,
            pointsRequiredForDiscount: 0
          }
          
        },
        factoryName: ''
      };
    },
    mounted() {
      this.fetchFactory();
    },
    methods: {
      async fetchFactory() {
        const url = window.location.href;
        const parts = url.split('/');
        const factoryId = parts[parts.length - 2];
        try {
          const response = await axios.get(`http://localhost:3000/api/factories/${factoryId}`);
          this.user.chocolateFactory.id = response.data.id;
          this.factoryName = response.data.name;
          this.user.chocolateFactory.name = response.data.name;
        } catch (error) {
          console.error('Error fetching factory:', error);
          alert('Error loading factory details. Please try again later.');
        }
      },
      async createUser() {
        try {
          await axios.post('http://localhost:3000/api/users', this.user);
          alert('User created successfully!');
          this.$router.push(`/factory/my`);
        } catch (error) {
          console.error('Error creating user:', error);
          alert('There was an error creating the user. Please try again.');
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
  
  .user-creation {
    max-width: 600px;
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
  
  .card-body {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }
  
  .form-control {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 100%;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 1rem;
    font-weight: bold;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn:hover {
    opacity: 0.8;
  }
  </style>
  