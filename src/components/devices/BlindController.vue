<script setup lang="ts">
import { ref, watchEffect } from 'vue'

defineProps<{
  device_id: string
}>()

// Fetch the device's data
// const data = api()

const height = ref(50)
watchEffect(() => {
  // Update the server with the new value
  console.log(height.value)
})
</script>

<template>
  <div>
    <v-slider
      label="Altura"
      v-model="height"
      :min="0"
      :max="100"
      :step="1"
      thumb-label="always"
      color="primary"
    >
      <template #thumb-label>
        <p class="text-accent">{{ height }}%</p>
      </template>
    </v-slider>
  </div>
</template>
