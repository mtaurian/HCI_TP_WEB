<script setup lang="ts">
import type { Routine } from '@/api'

const props = defineProps<{
  routine: Routine
  isSelected: boolean
}>()

defineEmits<{
  click: [string]
}>()
</script>

<template>
  <div class="container">


  <v-card  min-height="10vh" :color="isSelected ? 'focus' : ''" @click="$emit('click', routine.id)">
    <v-card-item >
      <template v-slot:title>
        <div class="flex">
        {{ props.routine.name }}
          <v-btn icon="mdi-play" variant="tonal"/>
        </div>
      </template>
      <template v-slot:subtitle>
        <p class="capitalize">
          Proxima ejecución: {{ props.routine.name }}
        </p>
      </template>
    </v-card-item>
  </v-card>
  </div>
</template>

<style scoped>
.capitalize::first-letter {
  text-transform: capitalize;
}
.flex{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.container{
  margin-right: 0.5rem;
}
</style>
