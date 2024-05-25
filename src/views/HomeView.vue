<script setup lang="ts">
import ControllerPlaceholder from '@/components/ControllerPlaceholder.vue'
import DevicesList from '@/components/DevicesList.vue'
import AddDevice from '@/components/AddDevice.vue'
import { change_device_room, delete_device } from '@/api'
import { useRoomStore, useDeviceStore } from '@/stores'
import { ref, watchEffect } from 'vue'

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
  roomStore.invalidate()
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

const new_device_dialog = ref(false)
function closeDialog() {
  setTimeout(() => {
    new_device_dialog.value = false
  }, 500)
}
</script>

<template>
  <AddDevice v-if="new_device_dialog" @turnoff="closeDialog" />

  <main v-if="roomStore.room">
    <div class="list">
      <DevicesList />
    </div>
    <div class="separator"></div>
    <div class="controller">
      <div class="placeholder">
        <ControllerPlaceholder @change_room="changeRoom" @delete="deleteDevice" />
      </div>
      <div class="fab">
        <v-btn
          rounded
          height="50"
          color="white"
          width="170"
          @click="new_device_dialog = true"
          prepend-icon="mdi-plus"
          size=""
          text="DISPOSITIVO"
        />
      </div>
    </div>
  </main>
  <div v-else class="roomless">
    <p>This house doesn't have rooms... yet</p>
    <p>Add the first one in the room picker!</p>
  </div>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  width: 100%;
}

.controller > .placeholder {
  width: 80%;
  height: 80%;
}

.controller > .fab {
  width: 90%;
  display: flex;
  justify-content: right;
}

.list {
  display: flex;
  margin-top: 1%;
  justify-content: center;
  align-items: center;
}

.roomless {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
