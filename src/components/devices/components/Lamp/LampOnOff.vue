<template>
  <div class="power-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="isOn ? 'green-lighten-2' : 'red-lighten-2'"
      :size="50"
      variant="text"
    >
      <v-icon icon="mdi-power" :size="50" />
    </v-btn>
    <v-label>{{ isOn ? 'On' : 'Off' }}</v-label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ApiReturns, execute_device_action } from '@/api'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

enum PowerState {
  ON = 'on',
  OFF = 'off'
}

const isOn = computed(() => {
  return props.state.result.status === PowerState.ON
})

const emit = defineEmits(['power-changed'])

/**
 * If lamp is on and button pressed, turnOff.
 * Else turnOn.
 */
const handleOnClick = async () => {
  if (isOn.value) {
    await execute_device_action(props.device_id, 'turnOff', [])
    emit('power-changed')
  } else {
    await execute_device_action(props.device_id, 'turnOn', [])
    emit('power-changed')
  }
}
</script>

<style scoped>

.power-button{
  display : flex;
  margin-right: 20px;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}

</style>