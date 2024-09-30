<script setup>
import Factories from '../components/FactoriesList.vue'
</script>

<template> 
      <header class="complex-header">
      <div class="overlay"></div>
      <div class="header-content">
        <h1 class="company-name">ChocolateFactory</h1>
        <p class="company-tagline">Sweetening Lives, One Chocolate at a Time</p>
        <p class="company-history">
          Since 1950, ChocolateFactory has been creating the finest chocolates using traditional methods and the highest quality ingredients. Step into our world and discover the passion and craftsmanship behind every piece of chocolate.
        </p>
      </div>
    </header>
</template>

<style scoped>
.body, html {
  margin: 0;
  padding: 0;

}

.complex-header {
  position: relative;
  background: url('https://source.unsplash.com/random/1920x600?chocolate,factory') no-repeat center center/cover;
  padding: 60px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: white;
  margin-bottom: 30px;
}

.complex-header .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.company-name {
  font-size: 4rem;
  margin: 0 0 20px;
  font-family: 'Raleway', sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.company-tagline {
  font-size: 1.5rem;
  font-style: italic;
  margin: 0 0 10px;
  color: #ffcc00;
}

.company-history {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #f3f3f3;
}

</style>
