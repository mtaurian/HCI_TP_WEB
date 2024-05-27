<script setup lang="ts">
import { useHomeStore, useRoutineStore } from '@/stores'
import RoutineCard from '@/components/routines/RoutineCard.vue'

const homeStore = useHomeStore()
const routineStore = useRoutineStore()

async function set_routine(id: string) {
  try {
    await routineStore.setCurrentRoutine(id)
  } catch (error) {
    alert('Error setting routine')
    return
  }

  const devices = JSON.parse(localStorage.getItem('last_routine') ?? '{}')
  devices[homeStore.home!.id] = id
  localStorage.setItem('last_routine', JSON.stringify(devices))
}
</script>

<template>
  <div class="device-list-container">
    <RoutineCard
      v-for="item in homeStore.routines"
      :key="item.id"
      :isSelected="item.id === routineStore.routine?.id"
      :routine="item"
      @click="set_routine"
    />
  </div>
</template>

<style scoped>
.device-list-container {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 80vh;
  overflow-y: auto;
}
</style>
