<template>
    <form @submit.prevent="register" class="register-form">
      <h2>Sign Up</h2>
      <div class="input-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="input-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <div class="input-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div class="input-group">
        <label for="surname">Surname:</label>
        <input type="text" id="surname" v-model="surname" required>
      </div>
      <div class="input-group">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
      <div class="input-group">
        <label for="dateOfBirth">Date of Birth:</label>
        <input type="date" id="dateOfBirth" v-model="dateOfBirth" required>
      </div>
      <button type="submit" class="register-button">Sign Up</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const name = ref('');
  const surname = ref('');
  const gender = ref('');
  const dateOfBirth = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const register = async () => {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match.';
      return;
    }
  
    try {
      const userData = {
        username: username.value,
        password: password.value,
        name: name.value,
        surname: surname.value,
        gender: gender.value,
        dateOfBirth: dateOfBirth.value,
        role: 'customer',
        purchases: [],
        cart: [],
        chocolateFactory: {
          id: '',
          name: ''
        },
        points: 0,
        customerType: {
          name: 'Regular',
          discountPercentage: 0,
          pointsRequiredForDiscount: 0
        },
        deleted: false,
        blocked: false
      };
  
      const response = await axios.post('http://localhost:3000/api/users', userData);
  
      if (response.status === 201) {
        alert('Registration successful! Logging you in...');
  
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
          username: username.value,
          password: password.value
        });
  
        if (loginResponse.status === 200) {
          const token = loginResponse.data.token;
          const user = loginResponse.data.username;
          const role = loginResponse.data.role;
          const id = loginResponse.data.id;
          const factoryId = loginResponse.data.factoryId;
          const blocked = loginResponse.data.blocked;
  
          if (blocked) {
            alert('You are blocked from the system, please contact the admin.');
            router.push('/').then(() => {
              window.location.reload();
            });
            return;
          }
  
          localStorage.setItem('token', token);
          localStorage.setItem('username', user);
          localStorage.setItem('role', role);
          localStorage.setItem('id', id);
          localStorage.setItem('factoryId', factoryId);
  
          router.push('/').then(() => {
            window.location.reload();
          });
        } else {
          errorMessage.value = 'Login failed after registration. Please try logging in manually.';
        }
      } else {
        errorMessage.value = 'Registration failed. Please try again.';
      }
    } catch (error) {
      if (error.response) {
        errorMessage.value = error.response.data.message || 'Registration failed.';
      } else {
        errorMessage.value = 'Network error. Please try again later.';
      }
    }
  };
  </script>
  
  <style scoped>
  .register-form {
    display: flex;
    flex-direction: column;
    width: 350px;
    padding: 20px;
    margin: auto;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="password"],
  input[type="date"],
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  .register-button {
    background-color: #007BFF;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }
  
  .register-button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  