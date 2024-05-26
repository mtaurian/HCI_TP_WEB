<template>
  <div class="row">
    <v-row>
      <v-col>
        <PowerButton class="power" v-if="state" :device_id="props.device_id" :state="state" @power-changed="updateDeviceState" />
      </v-col>
      <v-col>
        <TempInput v-if="state" :device_id="props.device_id" :state="state" @temp-changed="updateDeviceState" />
      </v-col>
    </v-row>
    <v-row>
      <ModeButtons v-if="state" :device_id="props.device_id" :state="state" @mode-changed="updateDeviceState" />
    </v-row>
    <v-row>
      <VerticalSwing v-if="state" :device_id="props.device_id" :state="state" @vertical-slider="updateDeviceState" />
    </v-row>
    <v-row>
      <HorizontalSwing v-if="state" :device_id="props.device_id" :state="state" @horizontal-slider="updateDeviceState" />
    </v-row>
    <v-row v-if="fanOn">
      <FanSpeed v-if="state" :device_id="props.device_id" :state="state" @speed-changed="updateDeviceState"/>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { type ApiReturns, get_device_state } from '@/api'
import PowerButton from '@/components/devices/components/AC/ACOnOff.vue'
import TempInput from '@/components/devices/components/AC/ACTemperature.vue'
import ModeButtons from '@/components/devices/components/AC/ACMode.vue'
import VerticalSwing from '@/components/devices/components/AC/ACVertical.vue'
import HorizontalSwing from '@/components/devices/components/AC/ACHorizontal.vue'
import FanSpeed from '@/components/devices/components/AC/ACFanSpeed.vue'

const props = defineProps<{
  device_id: string
}>()

const state = ref<{  result: Record<string, ApiReturns>; }>()

const fanOn = computed(() => {
  return state.value?.result.mode === 'fan'
})

const updateDeviceState = async () => {
  state.value = await get_device_state(props.device_id)
}

onMounted(async () => {
  await updateDeviceState()
  setInterval(updateDeviceState, 60000) // update state every minute
})
</script>

<style>
.power {
  margin-right: 2rem;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 1rem;
}

</style>
