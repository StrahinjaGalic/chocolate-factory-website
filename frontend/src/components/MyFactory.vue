<template>
    <div class="factory-details">
      <h1>Factory Details</h1>
      <div v-if="factory != null">
        <div class="card">
          <div class="card-body">
            <div class="card-content">
              <div class="card-text-content">
                <h2 class="card-title">{{ factory.name }}</h2>
                <p class="card-text"><strong>Location:</strong> {{ factory.location?.address || 'Loading...' }}</p>
                <p class="card-text"><strong>Working Hours:</strong> {{ factory.workingHours }}</p>
                <p class="card-text"><strong>Status:</strong> {{ factory.status }}</p>
                <p class="card-text"><strong>Rating:</strong> {{ factory.rating }}</p>
              </div>
              <span><img :src="factory.logo" alt="Factory Logo" class="factory-logo" width="300px" height="200px"></span>
            </div>
            <p class="card-text"><strong>Chocolates:</strong></p>
            <div class="chocolates-container">
              <div class="chocolate-card" v-for="chocolate in chocolates" :key="chocolate.id">
                <img :src="chocolate.image" alt="Chocolate Image" class="chocolate-image">
                <div class="chocolate-info">
                  <h3>{{ chocolate.name }}</h3>
                  <p>{{ chocolate.type }}, {{ chocolate.kind }}</p>
                  <p>{{ chocolate.price }}$</p>
                  <p>Quantity: {{ chocolate.quantity }}</p>
                  <div class="chocolate-actions" v-if="role === 'manager' || role === 'admin'">
                    <button class="remove-button" @click="removeChocolate(chocolate.id)">Remove</button>
                    <router-link :to="`/chocolate/${chocolate.id}/update`" class="update-button">Update</router-link>
                  </div>
                  <div class="chocolate-actions" v-if="role === 'worker'">
                    <button class="remove-button" @click="addChoco(chocolate.id)">Add</button>
                    <button class="remove-button" @click="subtractChoco(chocolate.id)">Subtract</button>
                    
                 </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="comments-section">
          <h2>Comments for {{ factory.name }}</h2>
          <div v-if="comments.length > 0">
            <div class="comment-card" v-for="comment in filteredComments" :key="comment.id">
              <p class="comment-text">{{ comment.text }}</p>
              <div class="comment-rating">
                <strong>Rating:</strong>
                <span v-for="n in comment.rating" :key="n" class="star">★</span>
              </div>
              <div v-if="!comment.approved">
                <button class="update-button" @click="approveComment(comment.id)">Approve</button>
              </div>
            </div>
          </div>
          <div v-else>
            <p class="no-comments">No comments for this factory.</p>
          </div>
        </div>
        <div class="actions" v-if="role === 'manager' || role === 'admin'">
          <router-link :to="`/factory/${factory.id}/add-chocolate`" class="add-button">Add Chocolate</router-link>
          <router-link :to="`/factory/${factory.id}/update`" class="update-factory-button">Update Factory</router-link>
          <router-link :to="`/factory/${factory.id}/add-worker`" class="add-button">Add Worker</router-link>
        </div>
      </div>
      <div v-else>
        <h2>You don't have an assigned factory yet...</h2>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        factory: null,
        chocolates: [],
        comments: []
      };
    },
    mounted() {
      this.fetchFactoryDetails();
      this.role = localStorage.getItem('role');
    },
    computed: {
      filteredComments() {
        this.comments = this.comments.filter(comment => comment.factory === this.factory.id && comment.deleted === false);
  
        if (this.role === 'admin' || this.role === 'manager') {
          return this.comments;
        } else {
          this.comments = this.comments.filter(comment => comment.approved === true);
        }
      }
    },
    methods: {
      async fetchFactoryDetails() {
        const factoryId = localStorage.factoryId;
        try {
          const [factoryResponse, commentsResponse] = await Promise.all([
            axios.get(`http://localhost:3000/api/factories/${factoryId}`),
            axios.get(`http://localhost:3000/api/comments`)
          ]);
  
          this.factory = factoryResponse.data;
          this.comments = commentsResponse.data;
          this.chocolates = this.factory.chocolates;
  
        } catch (error) {
          console.error('Error fetching factory details:', error);
          alert('Error loading factory details. Please try again later.');
        }
      },
      async removeChocolate(chocolateId) {
        try {
          this.factory.chocolates = this.factory.chocolates.filter(chocolate => chocolate.id !== chocolateId);
          await axios.put(`http://localhost:3000/api/factories/${this.factory.id}`, this.factory);
          this.chocolates = this.factory.chocolates;
        } catch (error) {
          console.error('Error removing chocolate:', error);
          alert('There was an error removing the chocolate. Please try again.');
        }
      },
      async addChoco(chocolateId)
      {
        try {
          const chocolate = this.factory.chocolates.find(chocolate => chocolate.id === chocolateId);
          chocolate.quantity += 1;
          await axios.put(`http://localhost:3000/api/chocolates/${chocolateId}`, chocolate);
          await axios.put(`http://localhost:3000/api/factories/${this.factory.id}`, this.factory);
          this.chocolates = this.factory.chocolates;
        } catch (error) {
          console.error('Error adding chocolate:', error);
          alert('There was an error adding the chocolate. Please try again.');
        }
      },
      async subtractChoco(chocolateId)
      {
        try {
          const chocolate = this.factory.chocolates.find(chocolate => chocolate.id === chocolateId);
          if(chocolate.quantity > 0)
          {
            chocolate.quantity -= 1;
            await axios.put(`http://localhost:3000/api/chocolates/${chocolateId}`, chocolate);
            await axios.put(`http://localhost:3000/api/factories/${this.factory.id}`, this.factory);
            this.chocolates = this.factory.chocolates;
          }
          else
          {
            alert('There are no chocolates left');
          }
        } catch (error) {
          console.error('Error subtracting chocolate:', error);
          alert('There was an error subtracting the chocolate. Please try again.');
        }
      },
      async approveComment(commentId) {
        try {
          const comment = this.comments.find(comment => comment.id === commentId);
          comment.approved = true;
          let rating = (this.factory.rating + comment.rating) / 2;
          this.factory.rating = rating;
          await axios.put(`http://localhost:3000/api/factories/${this.factory.id}`, this.factory);
          await axios.put(`http://localhost:3000/api/comments/${commentId}`, comment);
         
      window.location.reload();
  
        } catch (error) {
          console.error('Error approving comment:', error);
          alert('There was an error approving the comment. Please try again.');
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
  
  .factory-details {
    max-width: 1200px;
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
  
  .card-title {
    font-size: 2rem;
    color: #333;
    margin-bottom: 15px;
  }
  
  .card-text {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #555;
  }
  
  .chocolates-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .chocolate-card {
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    width: calc(50% - 20px);
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  .chocolate-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .chocolate-image {
    width: 120px;
    height: 120px;
    border-radius: 5px;
    margin-right: 20px;
    object-fit: cover;
  }
  
  .chocolate-info {
    flex-grow: 1;
  }
  
  .chocolate-info h3 {
    font-size: 1.5rem;
    margin-bottom: 5px;
    color: #333;
  }
  
  .chocolate-info p {
    font-size: 1rem;
    margin: 0;
    color: #555;
  }
  
  .chocolate-actions {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  
  .remove-button, .update-button {
    display: inline-block;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    background-color: #444;
    border: none;
    color: #fff;
    margin-right: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .update-button {
    background-color: #007bff;
  }
  
  .remove-button:hover, .update-button:hover {
    opacity: 0.8;
  }
  
  .add-button, .update-factory-button {
    display: inline-block;
    padding: 10px 20px;
    margin : 5px;
    font-size: 16px;
    font-weight: bold;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
  }
  
  .add-button:hover, .update-factory-button:hover {
    opacity: 0.8;
  }
  
  .comments-section {
    margin-top: 40px;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
  }
  
  .comments-section h2 {
    margin-bottom: 20px;
    color: #4a4a4a;
  }
  
  .comment-card {
    background: linear-gradient(to right, #fdfbfb, #ebedee);
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    margin: 10px 0;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
  }
  
  .comment-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .comment-text {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 10px;
  }
  
  .comment-rating {
    display: flex;
    align-items: center;
  }
  
  .comment-rating strong {
    margin-right: 5px;
    color: #444;
  }
  
  .star {
    color: #ffcc00;
    margin-right: 2px;
  }
  
  .no-comments {
    font-size: 1rem;
    color: #777;
  }
  
  .actions {
    margin-top: 20px;
   
  }
  
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .card-text-content {
    flex: 1;
    margin-right: 20px;
  }
  
  .factory-logo {
    flex-shrink: 0;
  }
  </style>
  