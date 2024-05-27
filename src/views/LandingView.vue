<script setup lang="ts">
import router from '@/router'

const data = localStorage.getItem('user_data')
if (data) {
  router.replace({name:'dashboard'})
}
localStorage.setItem('user_data','1')
</script>

<template>
  <main class="text-accent">
    <header>
      <img src="@/assets/logo.png" alt="logo" />
      <h1>Simplifying your dream home</h1>
      <v-btn to="firststeps" size="x-large" class="bg-surface">START NOW</v-btn>
    </header>

    <v-expansion-panels variant="accordion">
      <v-expansion-panel
        title="What services do we offer?"
        text="At EasyLife Home we want to make your life easier by being able to manage your home devices without the need to stand up! From turning your light on to preheating the oven before you get home, we are here to make your home life easier!"
      ></v-expansion-panel>
      <v-expansion-panel
        title="What devices can it handle?"
        text="Air conditioners, blinds, faucets, lamps and vacuums."
      ></v-expansion-panel>
      <v-expansion-panel
        title="What platforms are compatible with EasyLife Home?"
        text=
          "All of them! You can use Google Chrome Microsoft Edge and Mozilla Firefox."
      ></v-expansion-panel>
    </v-expansion-panels>
  </main>
</template>

<style scoped>
main {
  display: grid;
  place-items: center;
  gap: 2rem;

  width: 60%;
  min-height: 100vh;

  margin: 0 auto;
  padding: 3rem;
  padding-top: 0;
}

header {
  display: grid;
  place-items: center;
  gap: 2rem;

  width: 70%;

  margin: 0 auto;
  padding: 1rem;
}

@media screen and (max-width: 768px) {
  main {
    width: 90%;
    padding: 5px;
  }

  header {
    width: 90%;
    padding: 0;
  }
}

@media screen and (max-width: 425px) {
  main {
    width: 100%;
    padding: 5px;
  }

  header {
    width: 100%;
    padding: 0;
  }
}

img {
  width: 40%;
  max-width: 300px;
}

h1 {
  text-align: center;
  font-size: 3rem;
  font-weight: 300;
}
</style>
