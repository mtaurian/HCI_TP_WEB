<template>
  <div>
    <div class="header">
      <PowerButton
        class="power"
        v-if="state"
        :device_id="props.device_id"
        :state="state"
        @power-changed="updateDeviceState"
      />
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
import { type ApiSong, get_device_state } from '@/api'
import PowerButton from '@/components/devices/components/Lamp/LampOnOff.vue'
import ColorPicker from '@/components/devices/components/Lamp/LampColorPicker.vue'

const props = defineProps<{
  device_id: string
}>()

const state = ref<{ result: Record<string, string | number | boolean | ApiSong[] | null> }>()

const updateDeviceState = async () => {
  state.value = await get_device_state(props.device_id)
}

onMounted(async () => {
  await updateDeviceState()
  setInterval(updateDeviceState, 60000) // update state every minute
})
</script>

<style>
.header {
  display: flex;
  margin-bottom: 3rem;
}

.power {
  margin-right: 2rem;
  align-items: center;
}

.color {
  margin-right: 10px;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;
}

.select {
  margin-bottom: 0.5rem;
}
.progressBar {
  margin-top: 1rem;
}
</style>
