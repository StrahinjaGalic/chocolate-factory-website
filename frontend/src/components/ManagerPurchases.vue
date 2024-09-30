<template>
  <div>
    <h1>Factory Purchases</h1>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="purchases.length === 0">No purchases found for your factory.</div>
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
              <td>
                <button @click="approvePurchase(purchase)" class="approve">Approve</button>
                <button @click="promptDisapprovePurchase(purchase)" class="disapprove">Disapprove</button>
              </td>
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
      <div v-if="groupedPurchases['Blokirano']?.length > 0">
        <h2>Disapproved</h2>
        <table>
          <thead>
            <tr>
              <th>Factory</th>
              <th>Chocolates</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="purchase in filteredAndSortedPurchases['Blokirano']" :key="purchase.id">
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
              <td>{{ purchase.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showDisapproveModal" class="modal">
      <div class="modal-content">
        <h2>Disapprove Purchase</h2>
        <textarea v-model="disapproveReason" placeholder="Reason for disapproval"></textarea>
        <div class="modal-buttons">
          <button @click="disapprovePurchase">Submit</button>
          <button @click="closeDisapproveModal">Cancel</button>
        </div>
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
const showDisapproveModal = ref(false);
const disapproveReason = ref('');
const purchaseToDisapprove = ref(null);

const fetchPurchases = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage.value = 'You must be logged in to view purchases.';
      return;
    }

    const factoryId = localStorage.getItem('factoryId');
    if (!factoryId) {
      errorMessage.value = 'Factory information is missing.';
      return;
    }

    const response = await axios.get('http://localhost:3000/api/purchases', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const allPurchases = response.data;
    purchases.value = allPurchases.filter(purchase => purchase.factory.id === factoryId && !purchase.deleted);
    
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

const approvePurchase = async (purchase) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `http://localhost:3000/api/purchases/${purchase.id}`,
      { status: 'Odobreno' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPurchases();
  } catch (error) {
    errorMessage.value = 'Failed to approve purchase. Please try again later.';
  }
};

const promptDisapprovePurchase = (purchase) => {
  purchaseToDisapprove.value = purchase;
  disapproveReason.value = '';
  showDisapproveModal.value = true;
};

const disapprovePurchase = async () => {
  if (!disapproveReason.value) {
    errorMessage.value = 'Please provide a reason for disapproval.';
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `http://localhost:3000/api/purchases/${purchaseToDisapprove.value.id}`,
      { status: 'Blokirano', reason: disapproveReason.value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPurchases();
    closeDisapproveModal();
  } catch (error) {
    errorMessage.value = 'Failed to disapprove purchase. Please try again later.';
  }
};

const closeDisapproveModal = () => {
  showDisapproveModal.value = false;
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

.approve {
  background-color: green;
}

.disapprove {
  background-color: red;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
