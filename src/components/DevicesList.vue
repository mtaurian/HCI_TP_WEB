<script setup lang="ts">
import DeviceCard from './DeviceCard.vue'
import { useRoomStore, useDeviceStore } from '@/stores'

const roomStore = useRoomStore()
const deviceStore = useDeviceStore()

async function set_device(id: string) {
  try {
    await deviceStore.setCurrentDevice(id)
  } catch (error) {
    alert('Error setting device')
    return
  }

  const devices = JSON.parse(localStorage.getItem('last_device') ?? '{}')
  devices[roomStore.room!.id] = id
  localStorage.setItem('last_device', JSON.stringify(devices))
}
</script>

<template>
  <div class="device-list-container">
    <DeviceCard
      v-for="item in roomStore.devices"
      :key="item.id"
      :deviceName="item.name"
      :state="`${item.state.status}`"
      :stateIcon="`${item.meta.deviceIcon}`"
      :isActive="item.id === deviceStore.device?.id"
      :id="item.id"
      @click="set_device"
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
  max-height: 80vh;
  overflow-y: auto;
}
</style>
