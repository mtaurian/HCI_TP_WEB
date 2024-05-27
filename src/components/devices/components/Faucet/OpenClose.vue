<template>
  <div class="power-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="isOpen ? 'green-lighten-2' : 'red-lighten-2'"
      height="80"
      width="80"
      variant="text"
    >
      <div class="iconPos">
        <v-icon :icon="isOpen ? 'mdi-water' : 'mdi-water-off'" size="50" />
        {{ isOpen ? 'Open' : 'Close' }}
      </div>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { execute_device_action } from '@/api'

const props = defineProps<{
  status: 'opened' | 'closed'
  dispensing: boolean
  device_id: string
}>()

const isOpen = computed(() => {
  console.log(props.status)
  return props.status === 'opened'
})

const emit = defineEmits(['click'])

const handleOnClick = async () => {
  if (isOpen.value) {
    await execute_device_action(props.device_id, 'close', [])
    emit('click')
  } else {
    await execute_device_action(props.device_id, 'open', [])
    emit('click')
  }
}
</script>

<style scoped>
.power-button {
  display: flex;
  margin-right: 20px;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
.iconPos {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra los elementos horizontalmente */
  align-items: center; /* Centra los elementos verticalmente */
  align-content: center;
}
</style>
