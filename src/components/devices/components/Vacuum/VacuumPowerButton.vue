<template>
  <div class="power-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="isOn ?  'green-lighten-2' : 'red-lighten-2'"
      height="80"
      width="100"
      variant="text"
      :disabled="Number(props.state.result?.batteryLevel) < 5 && !isOn"
    >
      <div class="iconPos">

      <v-icon class="mb-2" icon="mdi-power" :size="50" />
      {{isOn ? 'On' : (hasBattery() ? 'Off' : 'Low Battery')}}
      </div>
    </v-btn>
<!--    <v-label>{{isOn ? 'Pause' : (hasBattery() ? 'Start' : 'Low Battery')}}</v-label>-->
  </div>
  <div>
    <v-snackbar
      v-model="snackbar"
      multi-line
      timeout="3000"
    >
      {{ "Battery is very low. Going to charging base!" }}

    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { type ApiSong, type ApiState, execute_device_action, get_device_state } from '@/api'

const snackbar = ref(false);

const props = defineProps<{
  state : ApiState,
  device_id: string
}>()

enum PowerState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DOCKED = 'docked'
}

watch(() => props.state.result?.batteryLevel, async (newLvl, oldLvl) => {
  if (Number(newLvl) <= 1 && isOn){
    await handleVeryLowBattery();
  }
})

const isOn = computed(()=>{
  const vlb = hasVeryLowBattery();
  return props.state.result.status === PowerState.ACTIVE && !vlb;
})

const emit = defineEmits(['power-changed']);

/**
 * true if battery >= 5, otherwise false.
 */
const hasBattery = () => {
  return Number(props.state.result?.batteryLevel) >= 5
}

/**
 * true if battery <= 1, otherwise false
 */
const hasVeryLowBattery = () =>{
  return props.state.result?.batteryLevel as number <= 1
}

const handleVeryLowBattery = async () => {
  await execute_device_action(props.device_id, 'dock', []);
  emit('power-changed');
  snackbar.value = true;
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
    alert('Low battery, going back to dock');
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
  margin-right: 0.5rem;
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
