<script setup lang="ts">
import ControllerPlaceholder from '@/components/ControllerPlaceholder.vue'
import DevicesList from '@/components/DevicesList.vue'
import AddDevice from '@/components/AddDevice.vue'
import { update_device, change_device_room, delete_device } from '@/api'
import { useRoomStore, useDeviceStore, useHomeStore } from '@/stores'
import { ref } from 'vue'

const roomStore = useRoomStore()
const deviceStore = useDeviceStore()
const homeStore = useHomeStore()

async function changeName(name: string) {
  if (!deviceStore.device) return

  try {
    if (!(await update_device(deviceStore.device.id, name, deviceStore.device.meta)).result) {
      alert('No se pudo cambiar el nombre del dispositivo')
      return
    }
  } catch (error) {
    alert('No se pudo cambiar el nombre del dispositivo')
  }

  deviceStore.invalidate()
  roomStore.invalidate()
}

async function changeRoom(room: string) {
  if (!deviceStore.device) return

  const confirmation = confirm(
    `¿Estás seguro de que deseas mover el dispositivo ${deviceStore.device.name}?`
  )

  if (!confirmation) return

  try {
    if (!(await change_device_room(deviceStore.device.id, room)).result) {
      alert('No se pudo cambiar el dispositivo de habitación')
      return
    }
  } catch (error) {
    alert('No se pudo cambiar el dispositivo de habitación')
  }

  roomStore.invalidate()
}

const invalidRoutines = ref<string[]>([])

async function deleteDevice() {
  if (!deviceStore.device) return
  invalidRoutines.value = homeStore.routines
    .filter((r) => r.actions.map((a) => a.device.id).includes(deviceStore.device!.id))
    .map((r) => r.name)

  if (invalidRoutines.value.length) {
    unsafeDeleteDialog.value = true
    return
  }

  try {
    if (!(await delete_device(deviceStore.device.id)).result) {
      alert('No se pudo eliminar el dispositivo')
      return
    }
  } catch (error) {
    alert('No se pudo eliminar el dispositivo')
  }

  await roomStore.invalidate()
  if (roomStore.devices[0]) {
    await deviceStore.setCurrentDevice(roomStore.devices[0].id)
  } else {
    deviceStore.device = null
  }
}

const new_device_dialog = ref(false)
const deleteDialog = ref(false)
const unsafeDeleteDialog = ref(false)

function closeDialog() {
  setTimeout(() => {
    new_device_dialog.value = false
  }, 500)
}
</script>

<template>
  <AddDevice v-if="new_device_dialog" @turnoff="closeDialog" />

  <main v-if="roomStore.room" :class="!deviceStore.device? 'roomless':''">
    <div class="list">
      <DevicesList />
    </div>
    <div :class="deviceStore.device ? 'separator' : ''"></div>
    <div class="controller">
      <div class="placeholder">
        <ControllerPlaceholder
          v-if="deviceStore.device"
          @change_name="changeName"
          @change_room="changeRoom"
          @delete="deleteDialog = true"
        />
        <div v-else class="roomless">
          <img class="no_device" src="/no_room.png"/>
          <p>This room doesn't have any device! Try adding one to get started!</p>
        </div>
      </div>
      <div class="fab">
        <v-btn
          rounded
          height="50"
          color="white"
          width="150"
          @click="new_device_dialog = true"
          prepend-icon="mdi-plus"
          size=""
          text="Devices"
        />
      </div>
    </div>
  </main>
  <div v-else class="roomless">
    <img class="no_room" src="/no_room.png" alt="No room available"/>
    <h2>This house doesn't have rooms... yet</h2>
    <h2>Add the first one in the room picker!</h2>
  </div>

  <v-dialog theme="light" max-width="30rem" v-model="deleteDialog" persistent>
    <v-card>
      <div class="cardDialogTitle">
        <v-icon icon="mdi-alert" color="orange" size="large" />
        <v-card-title>Confirm Delete</v-card-title>
      </div>
      <div class="dialog">
        <v-card-text
          >Are you sure you want delete "{{ deviceStore.device?.name }}" from "{{
            roomStore.room?.name
          }}"?</v-card-text
        >
      </div>
      <div class="dialogActions">
        <v-card-actions>
          <v-btn color="primary" @click="() => (deleteDialog = false)">Cancel</v-btn>
          <v-btn
            color="error"
            class="buttons"
            @click="
              () => {
                deleteDevice()
                deleteDialog = false
              }
            "
            >Delete</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
  <v-dialog theme="light" max-width="30rem" v-model="unsafeDeleteDialog" persistent>
    <v-card>
      <div class="cardDialogTitle">
        <v-icon icon="mdi-alert-octagon" color="error" size="large" />
        <v-card-title>Unable to Delete</v-card-title>
      </div>
      <div class="dialog">
        <p>
          It seems like the device is being used by one or more routines. Remove the actions related
          with the device from the routines in order to safely delete "{{
            deviceStore.device?.name
          }}"
        </p>
        <br />
        <p>
          <strong> Linked Routines: </strong>
        </p>
        <ul class="invalidRoutinesList">
          <li :key="routine" v-for="routine in invalidRoutines">{{ routine }}</li>
        </ul>
      </div>
      <div class="dialogActions">
        <v-card-actions>
          <v-btn color="primary" @click="() => (unsafeDeleteDialog = false)">Accept</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
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

.dialog {
  margin-left: 1.3rem;
  margin-bottom: 1rem;
}
.cardDialogTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1.3rem;
  margin-top: 1rem;
}
.roomless {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.invalidRoutinesList {
  margin-left: 1.5rem;
}
.no_room{
  max-height: 60%;
  max-width: 60%;
}
.no_device{
  max-height: 80%;
  max-width: 80%;
}
</style>
