<script setup lang="ts">
import { ref, watch } from 'vue'

defineProps<{
  dispensing: boolean
  progress?: number
}>()

const emit = defineEmits<{
  change: [number, string]
}>()

const amount = ref(0)
const unit = ref('ml')

watch([amount, unit], () => {
  emit('change', amount.value, unit.value)
})
</script>

<template>
  <div class="slider" v-if="!dispensing">
    <v-slider
      label="Amount"
      v-model="amount"
      :min="1"
      :max="100"
      :step="1"
      thumb-label="always"
      color="primary"
    >
      <template #thumb-label>
        <p class="text-accent">{{ amount }}</p>
      </template>
    </v-slider>
    <div class="unit">
      <v-select
        v-model="unit"
        :items="['ml', 'cl', 'dl', 'l', 'dal', 'hl', 'kl']"
        variant="outlined"
      />
    </div>
  </div>
  <div class="progress" v-else>
    <p>Dispensing...</p>
    <v-progress-linear :model-value="progress" active color="primary" bg-color="blue" />
  </div>
</template>

<style scoped>
.slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.slider > .unit {
  width: 100px;
}

.progress {
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 0.8rem;
}
</style>
