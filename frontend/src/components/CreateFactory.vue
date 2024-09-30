<template>
  <div class="create-factory">
    <h1>Create Factory</h1>
    <form @submit.prevent="createFactory">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="factory.name" required />
      </div>
      <div class="form-group">
        <div v-if="location.address === ''">
          <label>Please select the location</label>
        </div>
        <div v-else>
          <label for="location">Location:</label>
          <label v-text="location.address"></label>
        </div>
        <map-component @location-selected="handleLocationSelect" class="location-dropdown"></map-component>
      </div>
      <div class="form-group">
        <label for="workingHours">Working Hours:</label>
        <div class="working-hours">
          <select id="workingHoursStart" v-model="workingHoursStart" required>
            <option value="" disabled>Starting</option>
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          <select id="workingHoursEnd" v-model="workingHoursEnd" required class="end-hours">
            <option value="" disabled>Ending</option>
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="factory.status" required>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div class="form-group">
        <label for="rating">Rating:</label>
        <input type="number" id="rating" v-model="factory.rating" required />
      </div>
      <div class="form-group">
        <label for="logo">Logo:</label>
        <input type="file" id="logo" @change="handleFileUpload" required />
      </div>

      <div v-if="managers.length === 0">
        <h2>Create New Manager</h2>
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="newManager.username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="newManager.password" required />
        </div>
        <div class="form-group">
          <label for="name-manager">Name:</label>
          <input type="text" id="name-manager" v-model="newManager.name" required />
        </div>
        <div class="form-group">
          <label for="surname">Surname:</label>
          <input type="text" id="surname" v-model="newManager.surname" required />
        </div>
        <div class="form-group">
          <label for="gender">Gender:</label>
          <select id="gender" v-model="newManager.gender" required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label for="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" v-model="newManager.dateOfBirth" required />
        </div>
      </div>

      <div v-else>
        <h2>Select Manager</h2>
        <div class="form-group">
          <label for="manager">Manager:</label>
          <select id="manager" v-model="selectedManagerId" required>
            <option v-for="manager in managers" :key="manager.id" :value="manager.id">
              {{ manager.name }} {{ manager.surname }}
            </option>
          </select>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Create Factory</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import MapComponent from './MapComponent.vue';

export default {
  name: 'CreateFactory',
  components: {
    MapComponent
  },
  data() {
    return {
      newManager: {
        username: '',
        password: '',
        name: '',
        surname: '',
        gender: '',
        dateOfBirth: '',
        role: 'manager',
        purchases: [],
        cart: [],
        chocolateFactory: '',
        points: 0,
        customerType: {
          name: '',
          discountPercentage: 0,
          pointsRequiredForDiscount: 0
        }
      },
      location: {
        longitude: '',
        latitude: '',
        address: ''
      },
      managers: [],
      unassignedManagers: [],
      selectedManagerId: '',
      factory: {
        name: '',
        chocolates: [],
        workingHours: '',
        status: '',
        location: {
          id: '',
          longitude: '',
          latitude: '',
          address: ''
        },
        logo: '',
        rating: ''
      },
      workingHoursStart: '00',
      workingHoursEnd: '00',
      hours: Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, '0')),
      logoFile: null
    };
  },
  mounted() {
    this.fetchManagers();
  },
  methods: {
    async createFactory() {
      this.factory.workingHours = `${this.workingHoursStart}h - ${this.workingHoursEnd}h`;
      await this.createLocation();

      if (this.logoFile) {
        const formData = new FormData();
        formData.append('file', this.logoFile);

        try {
          const uploadResponse = await axios.post('http://localhost:3000/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          this.factory.logo = uploadResponse.data.url;
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert('There was an error uploading the logo. Please try again.');
          return;
        }
      }

    

      try {
        const response = await axios.post('http://localhost:3000/api/factories', this.factory);
        this.$router.push(`/factory/${response.data.id}`);

        if (this.selectedManagerId) {
        await axios.put(`http://localhost:3000/api/users/${this.selectedManagerId}`, {
          chocolateFactory: {id:response.data.id,name:this.factory.name}
        });
      } else {
        await axios.post('http://localhost:3000/api/users', {
          ...this.newManager,
          role: 'manager',
          chocolateFactory: {id:response.data.id,name:this.factory.name}
        });
      }
      } catch (error) {
        console.error('Error creating factory:', error);
        alert('There was an error creating the factory. Please try again.');
      }
    },
    handleLocationSelect(location) {
      this.location.longitude = location.coordinates[0];
      this.location.latitude = location.coordinates[1];
      this.location.address = location.address;

      console.log(location.coordinates);
      console.log(location.address);
    },
    async createLocation() {
      try {
        const response = await axios.post('http://localhost:3000/api/locations', this.location);
        this.factory.location = response.data;
        console.log(this.locationId);
      } catch (error) {
        console.error('Error creating location:', error);
        alert('There was an error creating the location. Please try again.');
      }
    },
    async fetchManagers() {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        this.managers = response.data.filter(user => user.role === 'manager');
        this.managers = this.managers.filter(manager => !manager.chocolateFactory.id);
        console.log(this.unassignedManagers);
      } catch (error) {
        console.error('Error fetching managers:', error);
      }
    },
    handleFileUpload(event) {
      this.logoFile = event.target.files[0];
    }
  }
};
</script>

<style scoped>
.create-factory {
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

.form-group .working-hours {
  display: flex;
  gap: 10px;
}

.form-group .working-hours select {
  flex: 1;
}

.form-group .working-hours select.end-hours {
  flex: 1;
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

.location-dropdown {
  margin-top: 10px;
}
</style>
