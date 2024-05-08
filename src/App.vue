<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-main class="bg-background" scrollable>
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
