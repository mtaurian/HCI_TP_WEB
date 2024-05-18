<script setup lang="ts">
import { ref, watch } from 'vue'
import { execute_device_action } from '@/api'

const props = defineProps<{
  device_id: string
  height: number
}>()

const height = ref(props.height ?? 0)

watch(height, () => {
  // Update the server with the new value
  execute_device_action(props.device_id, 'setLevel', [height.value])
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
