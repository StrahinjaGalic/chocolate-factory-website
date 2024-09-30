<!-- Login.vue -->
<template>
  <form @submit.prevent="login" class="login-form">
    <h2>Login</h2>
    <div class="input-group">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="username" required>
    </div>
    <div class="input-group">
      <label for="password">Password:</label>
      <div class="password-wrapper">
        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required>
        <button type="button" class="toggle-password" @click="togglePasswordVisibility">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>
    <button type="submit" class="login-button">Login</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Import FontAwesome library and specific icons
import '@fortawesome/fontawesome-free/css/all.css';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const showPassword = ref(false);
const router = useRouter();

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  try {
    const usernameValue = username.value;
    const passwordValue = password.value;

    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: usernameValue,
      password: passwordValue
    });

    // Store the token and user details securely
    const token = response.data.token;
    const user = response.data.username;
    const role = response.data.role;
    const id = response.data.id;  // Retrieve the id from the response
    const factoryId = response.data.factoryId;  // Retrieve the factoryId from the response
    const blocked = response.data.blocked;
    if(blocked)
    {
     alert('You are blocked from the system, please contact the admin.');
     router.push('/').then(() => {
      window.location.reload();
    });
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('username', user);
    localStorage.setItem('role', role);
    localStorage.setItem('id', id);  // Store the id in localStorage
    localStorage.setItem('factoryId', factoryId);  // Store

    // Redirect to a protected route or update application state
    router.push('/').then(() => {
      window.location.reload();
    });

  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      errorMessage.value = error.response.data.message || 'Failed to login';
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      errorMessage.value = 'Network error. Please try again later.';
    } else {
      // Something else happened in making the request
      console.error('Error during request:', error.message);
      errorMessage.value = 'Failed to login. Please try again later.';
    }
  }
};
</script>

<style scoped>
.login-form {
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

input[type="text"], input[type="password"] {
  width: 100%;
  padding: 10px 40px 10px 10px; /* Adjusted padding to accommodate the icon */
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
}

.toggle-password {
  position: absolute;
  right: 10px; /* Adjusted position to be inside the input */
  background: none;
  border: none;
  color: #007BFF;
  cursor: pointer;
  font-size: 18px;
}

.login-button {
  background-color: #007BFF;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.login-button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>
