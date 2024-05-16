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

import BlindController from '@/components/devices/BlindController.vue'
import { useHouseStore, useRoomStore, useDeviceStore } from '@/stores'
import { onMounted, ref, type Ref } from 'vue'

const { home_rooms } = useHouseStore()

const { room } = useRoomStore()

const { device } = useDeviceStore()

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

const rooms: Ref<Awaited<typeof home_rooms>> = ref([])
onMounted(async () => {
  rooms.value = await home_rooms
})
</script>

<template>
  <div class="black-square">
    <div class="name">
      <h2>{{ device?.name }}</h2>
    </div>
    <div class="controller">
      <!-- Component picking here -->
      <p v-if="device?.type === 'aire'">Aire</p>
      <p v-else-if="device?.type === 'lampara'">Lámpara</p>
      <p v-else-if="device?.type === 'aspiradora'">Aspiradora</p>
      <p v-else-if="device?.type === 'heladera'">Heladera</p>
      <p v-else-if="device?.type === 'parlante'">Parlante</p>
      <p v-else-if="device?.type === 'grifo'">Grifo</p>
      <p v-else-if="device?.type === 'aspersor'">Aspersor</p>
      <BlindController v-else-if="device?.type === 'persiana'" device_id="fake_id" />
      <p v-else-if="device?.type === 'cortina'">Cortina</p>
      <p v-else-if="device?.type === 'toldo'">Toldo</p>
      <p v-else-if="device?.type === 'horno'">Horno</p>
      <p v-else-if="device?.type === 'puerta'">Puerta</p>
      <p v-else-if="device?.type === 'alarma'">Alarma</p>
      <p v-else>¡Dispositivo desconocido!</p>
    </div>

    <div class="actions">
      <div class="select">
        <v-select
          label="Cambiar habitación"
          :items="rooms.filter((r) => r.code !== room?.code)"
          item-text="name"
          item-value="id"
          @update:model-value="$emit('change_room', $event!)"
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
