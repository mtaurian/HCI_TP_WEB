<script setup lang="ts">
import { watch } from 'vue'
import DeviceCard from './DeviceCard.vue'
import { useRoomStore, useDeviceStore } from '@/stores'

const roomStore = useRoomStore()
const deviceStore = useDeviceStore()

watch(
  () => roomStore.devices,
  () => {
    if (roomStore.devices.length) {
      deviceStore.setCurrentDevice(roomStore.devices[0].id)
    }
  }
)
</script>

<template>
  <div class="device-list-container">
    <!-- The missing properties might be stored in the meta -->
    <!-- As soon as we find out how the API works... -->
    <DeviceCard
      v-for="item in roomStore.devices"
      :key="item.id"
      :deviceName="item.name"
      :state="`${item.state.status}`"
      stateIcon="item.stateIcon"
      :isActive="item.id === deviceStore.device?.id"
      :id="item.id"
      @click="deviceStore.setCurrentDevice(item.id)"
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
