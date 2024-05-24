<script setup lang="ts">
/**
 * This file needs a little clarification in respect to its scope:
 *
 * The component receives the device's data (name, id, type, room),
 * and renders the corresponding controller for the device, plus two
 * buttons: change room and delete device.
 *
 * Any interaction with this buttons is handled by the parent component.
 * Meanwhile, any interaction with the controller is handled by the
 * controller itself (the child).
 *
 * I think this manages to get the best of both worlds: the parent
 * handles generic actions, while the child handles specific actions.
 */

import { useHomeStore, useRoomStore, useDeviceStore } from '@/stores'
import { ref } from 'vue'
import AddHome from './AddHome.vue'
import BlindController from '@/components/devices/BlindController.vue'
import FaucetController from '@/components/devices/FaucetController.vue'
import LampController from '@/components/devices/LampController.vue'
import VacuumController from '@/components/devices/VacuumController.vue'

const homeStore = useHomeStore()
const roomStore = useRoomStore()
const deviceStore = useDeviceStore()

defineEmits<{
  /**
   * Emits an event to change the room of the device
   *
   * @param room The new room of the device
   */
  change_room: [string]
  /**
   * Emits an event to delete the device
   */
  delete: []
}>()

const change_room_value = ref(undefined as string | undefined)
</script>

<template>
  <div v-if="deviceStore.device" class="black-square">
    <div class="name">
      <h2>{{ deviceStore.device.name }}</h2>
    </div>
    <div class="controller">
      <!-- Component picking here -->
      <p v-if="deviceStore.device.type.name === 'aire'">Aire</p>
      <LampController
        v-else-if="deviceStore.device.type.name === 'lamp'"
        :device_id="deviceStore.device.id"
      />
      <VacuumController
        v-else-if="deviceStore.device.type.name === 'vacuum'"
        :device_id="deviceStore.device.id"
      />

      <p v-else-if="deviceStore.device.type.name === 'heladera'">Heladera</p>
      <p v-else-if="deviceStore.device.type.name === 'parlante'">Parlante</p>
      <FaucetController
        v-else-if="deviceStore.device.type.name === 'faucet'"
        :device_id="deviceStore.device.id"
        :device_name="deviceStore.device.name"
        :open="deviceStore.device.state.status === 'opened'"
        :meta="deviceStore.device.meta"
      >
        Grifo
      </FaucetController>
      <p v-else-if="deviceStore.device.type.name === 'aspersor'">Aspersor</p>
      <BlindController
        v-else-if="deviceStore.device.type.name === 'blinds'"
        :device_id="deviceStore.device.id"
        :height="deviceStore.device.state.level"
      />
      <p v-else-if="deviceStore.device.type.name === 'cortina'">Cortina</p>
      <p v-else-if="deviceStore.device.type.name === 'toldo'">Toldo</p>
      <p v-else-if="deviceStore.device.type.name === 'horno'">Horno</p>
      <p v-else-if="deviceStore.device.type.name === 'puerta'">Puerta</p>
      <p v-else-if="deviceStore.device.type.name === 'alarma'">Alarma</p>
      <p v-else>¡Dispositivo desconocido!</p>
    </div>

    <div class="actions">
      <div class="select">
        <v-select
          label="Cambiar habitación"
          :items="homeStore.rooms.filter((r) => r.id !== roomStore.room?.id)"
          item-title="name"
          item-value="id"
          v-model="change_room_value"
          @update:model-value="$emit('change_room', $event!), (change_room_value = undefined)"
          variant="underlined"
        ></v-select>
      </div>
      <div class="button">
        <v-btn @click="$emit('delete')" color="error">
          <template #prepend>
            <v-icon>mdi-delete</v-icon>
          </template>
          Eliminar
        </v-btn>
      </div>
    </div>
  </div>
  <div v-else>
    <p>
      ¡No hay dispositivo seleccionado! Tal vez una foto acá para decirle cómo agregar un
      dispositivo
    </p>
  </div>
</template>

<style scoped>
.black-square {
  width: 100%;
  height: 100%;
  padding: 2.2rem 3rem;

  background-color: #4a4458;

  display: grid;
  align-items: center;
  grid-template-rows: 10% 1fr 20%;
}

.controller,
.actions {
  margin: 0 1rem;
}

.actions {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
}

.select {
  margin-top: 0;
  padding: 0 1rem;
  grid-column: 1 / 3;
}

.select > * {
  width: 300px;
}

@media screen and (max-width: 1024px) {
  .select > * {
    width: 200px;
  }
}

@media screen and (max-width: 768px) {
  .select > * {
    width: 150px;
  }
}

.button {
  grid-column: -2;
}
</style>
