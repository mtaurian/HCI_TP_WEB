<script setup lang="ts">
import { watch } from 'vue'
import { useHomeStore, useRoutineStore } from '@/stores'
import RoutineCard from '@/components/routines/RoutineCard.vue'

const homeStore = useHomeStore()
const routineStore = useRoutineStore()

watch(
  () => homeStore.routines,
  () => {
    if (homeStore.routines.length) {
      routineStore.setCurrentRoutine(homeStore.routines[0].id)
    }
  }
)
</script>

<template>
  <div class="device-list-container">
    <RoutineCard
      v-for="item in homeStore.routines"
      :key="item.id"
      :isSelected="item.id === routineStore.routine?.id"
      :routine="item"
      @click="routineStore.setCurrentRoutine(item.id)"
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
  border-radius: 10px;
}
</style>
