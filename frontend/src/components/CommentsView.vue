<template>
  <div class="comments-view">
    <h1>Comments for {{ factoryName }}</h1>
    <div v-if="comments.length > 0">
      <div class="comment-card" v-for="comment in comments" :key="comment.id">
        <p class="comment-text">{{ comment.text }}</p>
        <div class="comment-rating">
          <strong>Rating:</strong>
          <span v-for="n in comment.rating" :key="n" class="star">★</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-comments">No comments for this factory.</p>
    </div>
    <div class="back-link">
      <router-link :to="`/factory/${factoryId}`">Back to Factory Details</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      factoryId: this.$route.params.id,
      factoryName: '',
      comments: []
    };
  },
  mounted() {
    this.fetchFactoryComments();
  },
  methods: {
    async fetchFactoryComments() {
      try {
        // Fetch factory details to get the factory name
        const factoryResponse = await axios.get(`http://localhost:3000/api/factories/${this.factoryId}`);
        this.factoryName = factoryResponse.data.name;

        // Fetch comments for the factory
        const commentsResponse = await axios.get(`http://localhost:3000/api/comments?factory=${this.factoryId}`);
        this.comments = commentsResponse.data;
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  }
};
</script>

<style scoped>
.comments-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
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
  flex-grow: 1;
}

.comment-rating {
  font-size: 1rem;
  color: #777;
  display: flex;
  align-items: center;
}

.star {
  color: #ffd700;
  margin-left: 5px;
}

.no-comments {
  text-align: center;
  font-size: 1.2rem;
  color: #999;
}

.back-link {
  margin-top: 20px;
  text-align: center;
}

.back-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.back-link a:hover {
  text-decoration: underline;
}
</style>
