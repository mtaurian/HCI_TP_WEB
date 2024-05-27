
<template>
  <div>
    <div class="header">
      <PowerButton  v-if="state" :device_id="props.device_id" :state="state" @power-changed="updateDeviceState" />
      <BackToHomeButton  v-if="state" :device_id="props.device_id" :state="state" @dock-changed="updateDeviceState"/>
    </div>
    <div>
      <SelectMode  v-if="state" :device_id="props.device_id" @mode-changed="updateDeviceState" :state="state"/>
      <ChangeWorkLocation  v-if="state" :device_id="props.device_id" @working-location-changed="updateDeviceState" :state="state"/>
    </div>
    <div>
      <ProgressBar v-if="state" :device_id="props.device_id" :state="state"/>
    </div>
  </div>
</template>



<script setup lang="ts">

import ProgressBar from '@/components/devices/components/Vacuum/ProgressBar.vue'
import PowerButton from '@/components/devices/components/Vacuum/VacuumPowerButton.vue'
import { onMounted, ref } from 'vue'
import { type ApiSong, type ApiState, get_device_state } from '@/api'
import SelectMode from '@/components/devices/components/Vacuum/SelectMode.vue'
import BackToHomeButton from '@/components/devices/components/Vacuum/BackToHomeButton.vue'
import ChangeWorkLocation from '@/components/devices/components/Vacuum/ChangeWorkLocation.vue'

const props = defineProps<{
  device_id: string
}>()

const state = ref<ApiState>() ;

const updateDeviceState = async () => {
  state.value = await get_device_state(props.device_id)
}

onMounted(async () => {
  await updateDeviceState()
  setInterval(updateDeviceState, 60000); // update state every minute
})

</script>

<style>


.header {
  display : flex;
  margin-bottom: 3rem;
  justify-items: center;
}


</style>