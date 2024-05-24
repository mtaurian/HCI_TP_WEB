<template>
  <div class="rows">
    <div class="columns">
      <div>
        <PowerButton
          class="power"
          v-if="state"
          :device_id="props.device_id"
          :state="state"
          @power-changed="updateDeviceState"
        />
      </div>
      <div>
        <BrigthnessSlider
          class="slider"
          v-if="state"
          :device_id="props.device_id"
          :state="state"
          @color-changed="updateDeviceState"
        />
      </div>
    </div>
    <div>
      <ColorPicker
        class="color"
        v-if="state"
        :device_id="props.device_id"
        :state="state"
        @color-changed="updateDeviceState"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type ApiReturns, get_device_state } from '@/api'
import PowerButton from '@/components/devices/components/Lamp/LampOnOff.vue'
import ColorPicker from '@/components/devices/components/Lamp/LampColorPicker.vue'
import BrigthnessSlider from '@/components/devices/components/Lamp/LampSlider.vue'

const props = defineProps<{
  device_id: string
}>()

const state = ref<{  result: Record<string, ApiReturns>; }>()

const updateDeviceState = async () => {
  state.value = await get_device_state(props.device_id)
}

onMounted(async () => {
  await updateDeviceState()
  setInterval(updateDeviceState, 60000) // update state every minute
})
</script>

<style>
.rows {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-items: center;
}
.columns {
  display: flex;
  flex-direction: column;
}
.power {
  margin-left: 50px;
  margin-right: 2rem;
  align-items: center;
}

.color {
  height: 40px;
  margin-bottom: 220px;
  align-items: center;
  align-content: center;
  justify-items: center;
}
.slider {
  margin-top: 25px;
}
</style>
