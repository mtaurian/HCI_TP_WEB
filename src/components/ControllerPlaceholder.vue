<script setup lang="ts">
defineProps<{
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
}>()

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
</script>

<template>
  <div class="black-square">
    <div>
      <!-- Component picking here -->
      <p v-if="device_type === 'aire'">Aire</p>
      <p v-else-if="device_type === 'lampara'">Lámpara</p>
      <p v-else-if="device_type === 'aspiradora'">Aspiradora</p>
      <p v-else-if="device_type === 'heladera'">Heladera</p>
      <p v-else-if="device_type === 'parlante'">Parlante</p>
      <p v-else-if="device_type === 'grifo'">Grifo</p>
      <p v-else-if="device_type === 'aspersor'">Aspersor</p>
      <p v-else-if="device_type === 'persiana'">Persiana</p>
      <p v-else-if="device_type === 'cortina'">Cortina</p>
      <p v-else-if="device_type === 'toldo'">Toldo</p>
      <p v-else-if="device_type === 'horno'">Horno</p>
      <p v-else-if="device_type === 'puerta'">Puerta</p>
      <p v-else-if="device_type === 'alarma'">Alarma</p>
      <p v-else>¡Dispositivo desconocido!</p>
    </div>

    <div class="actions">
      <div class="select">
        <v-select
          label="Cambiar habitación"
          :items="['Living', 'Cocina', 'idk']"
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
  background-color: #4a4458;

  display: grid;
  align-items: center;
  grid-template-rows: 1fr 20%;
}

.actions {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;

  margin: 0 2rem;
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
