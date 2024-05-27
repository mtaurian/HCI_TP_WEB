<script setup lang="ts">
console.log('Hello from the Ups page')
</script>

<template>
  <div>
    <h1>Oh, no, what did you do?</h1>
    <p>Seems like something is ugly broken</p>
    <RouterLink to="/dashboard">Retry?</RouterLink>
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
