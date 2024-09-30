<template>
  <div class="add-chocolate">
    <h1>Add Chocolate</h1>
    <div class="form-container">
      <form @submit.prevent="addChocolate">
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
          <input type="number" id="weight" v-model="chocolate.weight" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <textarea id="description" v-model="chocolate.description" required></textarea>
        </div>
        <div class="form-group">
          <label for="image">Image:</label>
          <input type="file" id="image" @change="onImageChange" required />
        </div>
        <button type="submit">Add Chocolate</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      chocolate: {
        name: '',
        price: 0,
        type: '',
        kind: '',
        weight: 0,
        description: '',
        image: '',
        quantity: 0
      },
      imageFile: null
    };
  },
  methods: {
    async onImageChange(event) {
      this.imageFile = event.target.files[0];
    },
    async addChocolate() {
      const factoryId = this.$route.params.id;
      try {
        // Upload the image file
        const formData = new FormData();
        formData.append('file', this.imageFile);
        const uploadResponse = await axios.post('http://localhost:3000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.chocolate.image = uploadResponse.data.url;

        // Set the status based on quantity
        this.chocolate.status = this.chocolate.quantity > 0 ? 'Ima na stanju' : 'Nema na stanju';

        // Add the new chocolate
        const chocolateResponse = await axios.post('http://localhost:3000/api/chocolates', this.chocolate);
        const newChocolate = chocolateResponse.data;

        // Add the chocolate to the factory
        await axios.post(`http://localhost:3000/api/factories/${factoryId}/chocolates`, { chocolate: newChocolate });

        alert('Chocolate added successfully!');
        this.$router.push(`/factory/${factoryId}`);
      } catch (error) {
        console.error('Error adding chocolate:', error);
        alert('There was an error adding the chocolate. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.add-chocolate {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(45deg, #6a1b9a, #8e24aa);
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.form-container {
  background-color: #2e2e2e;
  padding: 20px;
  border-radius: 10px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #8e24aa;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #6a1b9a;
}
</style>
