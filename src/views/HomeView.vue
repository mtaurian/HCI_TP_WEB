<script setup lang="ts">
import ControllerPlaceholder from '@/components/ControllerPlaceholder.vue'
import DevicesList from '@/components/DevicesList.vue'
import { change_device_room, delete_device } from '@/api'

import { useRoomStore, useDeviceStore } from '@/stores'

const roomStore = useRoomStore()
const deviceStore = useDeviceStore()

async function changeRoom(room: string) {
  if (!deviceStore.device) return

  const confirmation = confirm(`¿Estás seguro de que deseas mover este dispositivo?`)
  if (!confirmation) return

  try {
    if (!(await change_device_room(deviceStore.device.id, room)).result) {
      alert('No se pudo cambiar el dispositivo de habitación')
      return
    }
  } catch (error) {
    alert('No se pudo cambiar el dispositivo de habitación')
  }

  // !? :)
  roomStore.setCurrentRoom(roomStore.room!?.id)
}

async function deleteDevice() {
  if (!deviceStore.device) return

  const confirmation = confirm('¿Estás seguro de que deseas eliminar este dispositivo?')
  if (!confirmation) return

  try {
    if (!(await delete_device(deviceStore.device.id)).result) {
      alert('No se pudo eliminar el dispositivo')
      return
    }
  } catch (error) {
    alert('No se pudo eliminar el dispositivo')
  }

  roomStore.setCurrentRoom(roomStore.room!?.id)
}
</script>

<template>
  <main>
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <DevicesList />
    </div>
    <div class="separator"></div>
    <div class="controller">
      <div>
        <ControllerPlaceholder @change_room="changeRoom" @delete="deleteDevice" />
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
