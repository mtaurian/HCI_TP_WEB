
<template>
  <div>
    <div class="header">
      <PowerButton class="power" v-if="state" :device_id="props.device_id" :state="state" @power-changed="updateDeviceState" />
      <BackToHomeButton class="dock" v-if="state" :device_id="props.device_id" :state="state" @dock-changed="updateDeviceState"/>
    </div>
    <div>
      <SelectMode class="select" v-if="state" :device_id="props.device_id" @mode-changed="updateDeviceState" :state="state"/>
      <ChangeWorkLocation class="select" v-if="state" :device_id="props.device_id" @working-location-changed="updateDeviceState" :state="state"/>
    </div>
    <div>
      <ProgressBar class="progressBar" v-if="state" :device_id="props.device_id" :state="state"/>
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

.power{
  margin-right: 2rem;
  align-items: center;
}

.dock{
  margin-right: 10px;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;

}

.select{
  margin-bottom: 0.5rem;
}
.progressBar{
  margin-top: 1rem;
}
</style>