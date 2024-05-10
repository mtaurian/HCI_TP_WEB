<script setup lang="ts">
import { defineProps, ref } from 'vue'
import DeviceCard from './DeviceCard.vue';
import type { Device } from '@/api'

export type ListDevice = {
  device: Device,
  home_code: string,
  room_code: string,
  state: string,
  stateIcon: string
}

const props = defineProps<{
  devices: ListDevice[]
}>()

const selected = ref('')
const toggleDeviceActive = (key: string): void => {
  selected.value = key
}

</script>

<template>
  <div class="device-list-container">
    <DeviceCard
      v-for="item in devices"
      :key="item.device.id"
      :deviceName="item.device.name"
      :state="item.state"
      :stateIcon="item.stateIcon"
      :isActive="item.device.id === selected"
      :id="item.device.id"
      @click="toggleDeviceActive"
    />
  </div>

</template>

<style scoped>

.device-list-container {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
}

</style>
