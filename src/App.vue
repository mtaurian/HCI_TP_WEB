<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <v-app>
    <v-main class="bg-background" scrollable>
      <!-- Don't show the NavBar on the landing page -->
      <NavBar v-if="$route.name !== 'landing'" />
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
/* Hide scrollbar */
body::-webkit-scrollbar {
  display: none;
}

body {
  -ms-overflow-style: none; /* IE and Edge */
}
</style>
