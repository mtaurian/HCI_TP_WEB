<script setup lang="ts">
import ControllerPlaceholder from '@/components/ControllerPlaceholder.vue'
import DevicesList, { type ListDevice } from '@/components/DevicesList.vue'
import { computed, ref } from 'vue'

function changeRoom(room: string) {
  alert(`Room changed to ${room}`)
}

function deleteDevice() {
  alert('Device deleted')
}

//asume this is API data
const devices: ListDevice[] = [
  {
    device: { id: '1', name: 'Luz de la sala', actions: [], events: [], powerUsage: 0 },
    device_type: 'lampara',
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '2', name: 'Lampara Techo', actions: [], events: [], powerUsage: 0 },
    device_type: 'lampara',
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '3', name: 'Heladera', actions: [], events: [], powerUsage: 0 },
    device_type: 'heladera',
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '4', name: 'Parlante', actions: [], events: [], powerUsage: 0 },
    device_type: 'parlante',
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '5', name: 'Cortina', actions: [], events: [], powerUsage: 0 },
    device_type: 'persiana',
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  }
]

const selected_id = ref(devices[0].device.id)
const selected_device = computed(() => {
  return (
    devices.find((device) => device.device.id === selected_id.value) ??
    ({
      device: { name: 'FAKE - 404 - PANIK' }
    } as ListDevice)
  )
})
</script>

<template>
  <main>
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <DevicesList
        :devices="devices.filter((e) => e.room_code === $route.params.room)"
        v-model="selected_id"
      />
    </div>
    <div class="separator"></div>
    <div class="controller">
      <div>
        <ControllerPlaceholder
          :device_id="selected_id"
          :device_name="selected_device.device.name"
          :device_type="selected_device.device_type"
          :room_id="selected_device.room_code"
          :house_rooms="
            devices
              // Only get the data we need
              .map((device) => ({
                id: device.room_code,
                name: device.room_code
              }))
              // Remove duplicates
              .filter((room, index, self) => self.findIndex((r) => r.id === room.id) === index)
          "
          @change_room="changeRoom"
          @delete="deleteDevice"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  height: calc(100vh - 64px); /* full screen - NavBar */

  display: grid;
  grid-template-columns: 30% 2px 1fr;
}

.separator {
  background-color: #4a4458;
  margin: 1rem 0;
  opacity: 0.5;
}

.controller {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.controller > div {
  width: 80%;
  height: 80%;
}

.list {
  display: flex;
  margin-top: 1%;
  justify-content: center;
  align-items: center;
}
</style>
