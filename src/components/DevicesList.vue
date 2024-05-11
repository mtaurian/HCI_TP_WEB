<script setup lang="ts">
import type { Ref } from 'vue'
import DeviceCard from './DeviceCard.vue'
import type { Device } from '@/api'

export type ListDevice = {
  device: Device
  // Idk if this property will be within API's Device interface
  // Meanwhile, I can leave it here
  device_type:
    | 'lampara'
    | 'aire'
    | 'aspiradora'
    | 'heladera'
    | 'parlante'
    | 'grifo'
    | 'aspersor'
    | 'persiana'
    | 'cortina'
    | 'toldo'
    | 'horno'
    | 'puerta'
    | 'alarma'
  home_code: string
  room_code: string
  state: string
  stateIcon: string
}

defineProps<{
  devices: ListDevice[]
}>()

const selected = defineModel() as Ref<string>
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
      @click="selected = item.device.id"
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
