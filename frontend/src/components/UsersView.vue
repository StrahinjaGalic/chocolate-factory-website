<template>
  <div>
    <!-- Search Box -->
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="Search by name, surname, or username" class="search-box">
      <button @click="search" class="search-button">Search</button>
    </div>
    
    <!-- Sorting and Filtering Controls -->
    <div class="controls-container">
      <select v-model="sortBy" class="sort-dropdown">
        <option value="">Sort by</option>
        <option value="name">Name</option>
        <option value="surname">Surname</option>
        <option value="username">Username</option>
        <option value="points">Points</option>
      </select>
      
      <select v-model="sortOrder" class="sort-order">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      
      <select v-model="roleFilter" class="filter-dropdown">
        <option value="">Filter by role</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="worker">Worker</option>
        <option value="customer">Customer</option>
      </select>
      
      <select v-model="userTypeFilter" class="filter-dropdown">
        <option value="">Filter by customer type</option>
        <option value="Regular">Regular</option>
        <!-- Add other customer types as needed -->
      </select>
      
      <button @click="resetFilters" class="reset-button">Reset</button>
    </div>
    
    <!-- User Cards -->
    <div class="user-cards-container">
      <div v-for="user in filteredUsers" :key="user.id" class="user-card">
        <h3>{{ user.name }} {{ user.surname }}</h3>
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Gender:</strong> {{ user.gender }}</p>
        <p><strong>Date of Birth:</strong> {{ user.dateOfBirth }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
        <p><strong>Factory:</strong> {{ user.chocolateFactory.name }}</p>
        <p><strong>Points:</strong> {{ user.points }}</p>
        <p><strong>Customer Type:</strong> {{ user.customerType.name }}</p>
        <p><strong>Discount:</strong> {{ user.customerType.discountPercentage }}%</p>
        <p><strong>Points Required for Discount:</strong> {{ user.customerType.pointsRequiredForDiscount }}</p>
        <button v-if="user.role==='worker'" @click="promoteUser(user.id)" class="search-button">Promote</button>
        <button v-if="user.role==='manager'" @click="demoteUser(user.id)" class="reset-button">Demote</button>
        <button  v-if="user.role !== 'admin'"  @click="blockUser(user.id)" class="reset-button">Block</button>
      </div>
    </div>

    <!-- Suspicious Customers Section -->
    <div v-if="suspiciousCustomers.length">
      <h2>Suspicious Customers</h2>
      <div class="user-cards-container">
        <div v-for="user in suspiciousCustomers" :key="user.id" class="user-card">
          <h3>{{ user.name }} {{ user.surname }}</h3>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Gender:</strong> {{ user.gender }}</p>
          <p><strong>Date of Birth:</strong> {{ user.dateOfBirth }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>Factory:</strong> {{ user.chocolateFactory.name }}</p>
          <p><strong>Points:</strong> {{ user.points }}</p>
          <p><strong>Customer Type:</strong> {{ user.customerType.name }}</p>
          <p><strong>Discount:</strong> {{ user.customerType.discountPercentage }}%</p>
          <p><strong>Points Required for Discount:</strong> {{ user.customerType.pointsRequiredForDiscount }}</p>
          <button v-if="user.role==='worker'" @click="promoteUser(user.id)" class="search-button">Promote</button>
          <button v-if="user.role==='manager'" @click="demoteUser(user.id)" class="reset-button">Demote</button>
          <button @click="blockUser(user.id)" class="reset-button">Block</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      id: localStorage.getItem('id'),
      users: [],
      purchases: [],
      searchQuery: '',
      roleFilter: '',
      userTypeFilter: '',
      sortBy: '',
      sortOrder: 'asc' // 'asc' or 'desc'
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users.filter(user => !this.suspiciousCustomers.includes(user));

      // Apply role filter
      if (this.roleFilter) {
        filtered = filtered.filter(user => user.role === this.roleFilter);
      }

      // Apply customer type filter
      if (this.userTypeFilter) {
        filtered = filtered.filter(user => user.customerType.name === this.userTypeFilter);
      }

      // Apply sorting
      if (this.sortBy && ['name', 'surname', 'username', 'points'].includes(this.sortBy)) {
        filtered.sort((a, b) => {
          let aValue = a[this.sortBy];
          let bValue = b[this.sortBy];

          if (this.sortBy === 'points') {
            aValue = Number(aValue);
            bValue = Number(bValue);
          }

          if (this.sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
      }

      return filtered;
    },
    suspiciousCustomers() {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      return this.users.filter(user => {
        const canceledPurchasesCount = this.purchases.filter(purchase => purchase.customer === user.id && purchase.status === 'Otkazano').length;
        return canceledPurchasesCount >= 5;
      });
    }
  },
  created() {
    this.fetchUsers();
    this.fetchPurchases();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchPurchases() {
      try {
        const response = await axios.get('http://localhost:3000/api/purchases');
        this.purchases = response.data;
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    },
    async search() {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/search/${this.searchQuery}`);
        this.users = response.data;
      } catch (error) {
        console.error('Error searching users:', error);
      }
    },
    resetFilters() {
      this.searchQuery = '';
      this.roleFilter = '';
      this.userTypeFilter = '';
      this.sortBy = '';
      this.sortOrder = 'asc';
      this.fetchUsers();
      this.fetchPurchases();
    },
    async promoteUser(userId) {
      try {
        const user = this.users.find(user => user.id === userId);
        user.role = 'manager';
        await axios.put(`http://localhost:3000/api/users/${userId}`, user);
        window.location.reload();
      } catch (error) {
        console.error('Error promoting user:', error);
        alert('There was an error promoting the user. Please try again.');
      }
    },
    async demoteUser(userId) {
      try {
        const user = this.users.find(user => user.id === userId);
        user.role = 'worker';
        await axios.put(`http://localhost:3000/api/users/${userId}`, user);
        window.location.reload();
      } catch (error) {
        console.error('Error demoting user:', error);
        alert('There was an error demoting the user. Please try again.');
      }
    },
    async blockUser(userId) {
      try {
        const user = this.users.find(user => user.id === userId);
        user.blocked = true;
        await axios.put(`http://localhost:3000/api/users/${userId}`, user);
        window.location.reload();
      } catch (error) {
        console.error('Error blocking user:', error);
        alert('There was an error blocking the user. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.user-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.user-card {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-card h3 {
  margin-top: 0;
  color: orange
}

.user-card p {
  margin: 5px 0;
  color: black;
}

.search-container {
  display: flex;
  margin-bottom: 10px;
}

.search-box {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 5px;
}

.search-button {
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}

.controls-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.sort-dropdown,
.sort-order,
.filter-dropdown,
.reset-button {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.reset-button {
  background-color: #f44336;
  color: white;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #e53935;
}
</style>
