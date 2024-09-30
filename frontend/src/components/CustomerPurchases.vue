<template>
  <div>
    <h1>My Purchases</h1>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="purchases.length === 0">No purchases found.</div>
    <div v-else>
      <div>
        <h2>Filter and Sort</h2>
        <div class="filter-sort">
          <label>
            Factory:
            <input v-model="filters.factory" placeholder="Factory Name" />
          </label>
          <label>
            Price From:
            <input type="number" v-model.number="filters.priceFrom" min="0" placeholder="From" />
          </label>
          <label>
            Price To:
            <input type="number" v-model.number="filters.priceTo" min="0" placeholder="To" />
          </label>
          <label>
            Date From:
            <input type="date" v-model="filters.dateFrom" />
          </label>
          <label>
            Date To:
            <input type="date" v-model="filters.dateTo" />
          </label>
          <label>
            Sort By:
            <select v-model="sortBy">
              <option value="factory">Factory</option>
              <option value="price">Price</option>
              <option value="date">Date</option>
            </select>
          </label>
          <label>
            Order:
            <select v-model="sortOrder">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
          <div class="buttons">
            <button @click="applyFilters">Search</button>
            <button @click="resetFilters">Reset</button>
          </div>
        </div>
      </div>
      <div v-if="groupedPurchases['Obrada']?.length > 0">
        <h2>In Progress</h2>
        <table>
          <thead>
            <tr>
              <th>Factory</th>
              <th>Chocolates</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in filteredAndSortedPurchases['Obrada']" :key="purchase.id">
              <td>{{ purchase.factory.name }}</td>
              <td>
                <ul>
                  <li v-for="chocolate in purchase.chocolates" :key="chocolate.id">
                    {{ chocolate.name }} ({{ chocolate.quantity }})
                  </li>
                </ul>
              </td>
              <td>{{ formatDate(purchase.dateTime) }}</td>
              <td>{{ purchase.price }}</td>
              <td>{{ purchase.status }}</td>
              <td><button @click="cancelPurchase(purchase)">Cancel</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="groupedPurchases['Odobreno']?.length > 0">
        <h2>Approved</h2>
        <table>
          <thead>
            <tr>
              <th>Factory</th>
              <th>Chocolates</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in filteredAndSortedPurchases['Odobreno']" :key="purchase.id">
              <td>{{ purchase.factory.name }}</td>
              <td>
                <ul>
                  <li v-for="chocolate in purchase.chocolates" :key="chocolate.id">
                    {{ chocolate.name }} ({{ chocolate.quantity }})
                  </li>
                </ul>
              </td>
              <td>{{ formatDate(purchase.dateTime) }}</td>
              <td>{{ purchase.price }}</td>
              <td>{{ purchase.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const purchases = ref([]);
const errorMessage = ref('');
const groupedPurchases = ref({});
const filters = ref({
  factory: '',
  priceFrom: null,
  priceTo: null,
  dateFrom: '',
  dateTo: ''
});
const sortBy = ref('date');
const sortOrder = ref('asc');

const fetchPurchases = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    
    if (!token) {
      errorMessage.value = 'You must be logged in to view purchases.';
      return;
    }

    const response = await axios.get('http://localhost:3000/api/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const allPurchases = response.data;
    purchases.value = allPurchases.filter(purchase => purchase.customer === userId && !purchase.deleted);
    
    // Group purchases by status
    groupedPurchases.value = purchases.value.reduce((acc, purchase) => {
      if (!acc[purchase.status]) {
        acc[purchase.status] = [];
      }
      acc[purchase.status].push(purchase);
      return acc;
    }, {});
  } catch (error) {
    errorMessage.value = 'Failed to fetch purchases. Please try again later.';
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const applyFilters = () => {
  groupedPurchases.value = purchases.value.reduce((acc, purchase) => {
    if (!acc[purchase.status]) {
      acc[purchase.status] = [];
    }
    if (matchesFilters(purchase)) {
      acc[purchase.status].push(purchase);
    }
    return acc;
  }, {});
};

const resetFilters = () => {
  filters.value = {
    factory: '',
    priceFrom: null,
    priceTo: null,
    dateFrom: '',
    dateTo: ''
  };
  sortBy.value = 'date';
  sortOrder.value = 'asc';
  applyFilters();
};

const matchesFilters = (purchase) => {
  const matchesFactory = filters.value.factory === '' || purchase.factory.name.includes(filters.value.factory);
  const matchesPriceFrom = filters.value.priceFrom === null || purchase.price >= filters.value.priceFrom;
  const matchesPriceTo = filters.value.priceTo === null || purchase.price <= filters.value.priceTo;
  const matchesDateFrom = filters.value.dateFrom === '' || new Date(purchase.dateTime) >= new Date(filters.value.dateFrom);
  const matchesDateTo = filters.value.dateTo === '' || new Date(purchase.dateTime) <= new Date(filters.value.dateTo);
  return matchesFactory && matchesPriceFrom && matchesPriceTo && matchesDateFrom && matchesDateTo;
};

const filteredAndSortedPurchases = computed(() => {
  const sortPurchases = (purchases) => {
    return purchases.sort((a, b) => {
      if (sortBy.value === 'factory') {
        if (a.factory.name < b.factory.name) return sortOrder.value === 'asc' ? -1 : 1;
        if (a.factory.name > b.factory.name) return sortOrder.value === 'asc' ? 1 : -1;
      } else if (sortBy.value === 'price') {
        return sortOrder.value === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy.value === 'date') {
        return sortOrder.value === 'asc' ? new Date(a.dateTime) - new Date(b.dateTime) : new Date(b.dateTime) - new Date(a.dateTime);
      }
      return 0;
    });
  };

  const grouped = {};
  Object.keys(groupedPurchases.value).forEach(status => {
    grouped[status] = sortPurchases(groupedPurchases.value[status]);
  });
  return grouped;
});

const cancelPurchase = async (purchase) => {
  try {
    // Deduct points from the customer
    const pointsLost = Math.floor(purchase.price / 1000 * 133 * 4);
    const userId = localStorage.getItem('id');
    const userResponse = await axios.get(`http://localhost:3000/api/users/${userId}`);
    const user = userResponse.data;

    const updatedUser = { ...user, points: user.points - pointsLost };
    await axios.put(`http://localhost:3000/api/users/${userId}`, updatedUser);

    // Update the purchase status to canceled (or delete it)
    const updatedPurchase = { ...purchase, status: "Otkazano" ,deleted: true };
    await axios.put(`http://localhost:3000/api/purchases/${purchase.id}`, updatedPurchase);

    // Update the local state
    purchases.value = purchases.value.filter(p => p.id !== purchase.id);

    // Recalculate grouped purchases from the updated purchases array
    groupedPurchases.value = purchases.value.reduce((acc, purchase) => {
      if (!acc[purchase.status]) {
        acc[purchase.status] = [];
      }
      acc[purchase.status].push(purchase);
      return acc;
    }, {});
  } catch (error) {
    errorMessage.value = 'Failed to cancel the purchase. Please try again later.';
  }
};

onMounted(fetchPurchases);
</script>

<style scoped>
h1 {
  color: #333;
  margin-bottom: 20px;
}

h2 {
  margin-top: 20px;
  color: #444;
}

.filter-sort {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filter-sort label {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #dee2e6;
}

th {
  background-color: #555;
  color: #ffcc00;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(odd) {
  background-color: #fff;
}

tbody tr {
  color: black;
}

.error {
  color: red;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
