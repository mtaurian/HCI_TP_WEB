<template>
  <div class="power-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="isOn ? 'red-lighten-2' : 'green-lighten-2'"
      :size="50"
      variant="text"
      :disabled="Number(props.state.result?.batteryLevel) < 5"
    >
      <v-icon icon="mdi-power" :size="50" />
    </v-btn>
    <v-label>{{isOn ? 'Pause' : (hasBattery() ? 'Start' : 'Too Low Battery')}}</v-label>
  </div>
</template>

<script setup lang="ts">
import {  computed } from 'vue'
import { type ApiSong, execute_device_action, get_device_state } from '@/api'

const props = defineProps<{
  state : { result: Record<string, string | number | boolean | ApiSong[] | null> },
  device_id: string
}>()

enum PowerState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DOCKED = 'docked'
}

const isOn = computed(()=>{
  return props.state.result.status === PowerState.ACTIVE
})

const emit = defineEmits(['power-changed']);

/**
 * true if battery >= 5, otherwise false.
 */
const hasBattery = () => {
  return Number(props.state.result?.batteryLevel) >= 5
}

/**
 * If hasBattery and device isOff, starts.
 * If does not hasBattery, device isOFf, and device is not docked: goes to dock
 * If does not hasBattery, device isOff, and device is docked: do nothing
 * Else if device isOn, pauses.
 */
const handleOnClick = async () => {
  if (hasBattery() && !isOn.value){
    await execute_device_action(props.device_id,'start', []);
    emit('power-changed');
  } else if (!hasBattery() && !isOn.value && props.state.result.status !== PowerState.DOCKED){
    alert('Too low battery, going back to dock'); //TODO change it to modal and ask to confirm go to dock
    await execute_device_action(props.device_id,'dock', []);
    emit('power-changed');
  } else if (!hasBattery() && !isOn.value){
    alert('Too low battery to start right now');
  } else if (isOn.value){
    await execute_device_action(props.device_id,'pause', []);
    emit('power-changed');
  }
}
</script>

<style scoped>

.power-button{
  display : flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}

</style>
