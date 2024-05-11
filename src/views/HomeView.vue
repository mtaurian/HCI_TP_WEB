<script setup lang="ts">
import ControllerPlaceholder from '@/components/ControllerPlaceholder.vue'
import DevicesList, { type ListDevice } from '@/components/DevicesList.vue'

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
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '2', name: 'Lampara Techo', actions: [], events: [], powerUsage: 0 },
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '3', name: 'TV', actions: [], events: [], powerUsage: 0 },
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '4', name: 'Parlante', actions: [], events: [], powerUsage: 0 },
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  },
  {
    device: { id: '5', name: 'Cortina', actions: [], events: [], powerUsage: 0 },
    state: '1Estado',
    stateIcon: '../assets/ex.png',
    home_code: 'abc123',
    room_code: 'abc123-1'
  }
]
</script>

<template>
  <main>
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <DevicesList :devices="devices" />
    </div>
    <div class="separator"></div>
    <div class="controller">
      <div>
        <ControllerPlaceholder
          device_type="lampara"
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
