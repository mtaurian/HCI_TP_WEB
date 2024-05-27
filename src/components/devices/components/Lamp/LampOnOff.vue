<template>
  <div class="power-button">
    <v-btn
      width="100"
      height="100"
      @click="handleOnClick"
      :color="isOn ? 'green-lighten-2' : 'red-lighten-2'"
      variant="text"
    >
      <div class="iconPos">
        <v-icon class="mb-2" icon="mdi-power" :size="50" />
      {{ isOn ? 'On' : 'Off' }}
    </div>
    </v-btn>
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
<style>
.power-button{
  display : flex;
  margin-right: 20px;
  flex-direction: column;
  margin-left: 1rem;
  align-items: center;
}

.iconPos{
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra los elementos horizontalmente */
  align-items: center; /* Centra los elementos verticalmente */
  align-content: center;
}
</style>