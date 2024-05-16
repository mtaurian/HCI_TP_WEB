<script setup lang="ts">
import DeviceCard from './DeviceCard.vue'
import { useRoomStore, useDeviceStore } from '@/stores'

const { room_devices } = useRoomStore()

const { device, setCurrentDevice } = useDeviceStore()

const devices = await room_devices
</script>

<template>
  <div class="device-list-container">
    <!-- The missing properties might be stored in the meta -->
    <!-- As soon as we find out how the API works... -->
    <DeviceCard
      v-for="item in devices"
      :key="item.code"
      :deviceName="item.name"
      state="item.state"
      stateIcon="item.stateIcon"
      :isActive="item.code === device?.code"
      :id="item.code"
      @click="setCurrentDevice(item.code)"
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
