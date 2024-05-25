<script setup lang="ts">
console.log('Hello from the NotFound page')
</script>

<template>
  <div>
    <h1>You look lost, my friend</h1>
    <RouterLink to="/dashboard">Want some help to get back home?</RouterLink>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
