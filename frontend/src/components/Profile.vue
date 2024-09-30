<template>
    <div class="edit-profile">
      <h1>Edit Profile</h1>
      <form @submit.prevent="updateProfile">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="user.username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="user.password" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" />
        </div>
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="user.name" required />
        </div>
        <div class="form-group">
          <label for="surname">Surname:</label>
          <input type="text" id="surname" v-model="user.surname" required />
        </div>
        <div class="form-group">
          <label for="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" v-model="user.dateOfBirth" required />
        </div>
        <div class="form-group">
          <label for="gender">Gender:</label>
          <select id="gender" v-model="user.gender" required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {
          id: '',
          username: '',
          password: '',
          name: '',
          surname: '',
          gender: '',
          dateOfBirth: ''
        },
        confirmPassword: ''
      };
    },
    created() {
      this.fetchUserProfile();
    },
    methods: {
      async fetchUserProfile() {
        try {
          const userId = this.$route.params.id; // Get the user ID from the URL
          console.log(userId);
          const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
          this.user = response.data;
        } catch (error) {
          console.error('Error fetching user profile:', error);
          alert('There was an error fetching your profile. Please try again.');
        }
      },
      async updateProfile() {
        if (this.user.password !== this.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
  
        try {
          await axios.put(`http://localhost:3000/api/users/${this.user.id}`, this.user);
          alert('Profile updated successfully!');
          this.$router.push('/');
        } catch (error) {
          console.error('Error updating profile:', error);
          alert('There was an error updating your profile. Please try again.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .edit-profile {
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
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>
  