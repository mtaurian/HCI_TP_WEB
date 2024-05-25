<script setup lang="ts">

import { useHomeStore, useRoutineStore } from '@/stores'

const routineStore = useRoutineStore();
const homeStore = useHomeStore();


</script>

<template>
  <div v-if="routineStore.routine" class="black-square">
      <div class="name">
        <h2>{{ routineStore.routine.name }}</h2>
      </div>
      <div class="controller">
      </div>

      <div class="actions">
        <div class="select">
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
  </div>
  <div v-else>
    <p>
      ¡No hay rutina seleccionada! Tal vez una foto acá para decirle cómo agregar un
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

.select>* {
  width: 300px;
}

@media screen and (max-width: 1024px) {
  .select>* {
    width: 200px;
  }
}

@media screen and (max-width: 768px) {
  .select>* {
    width: 150px;
  }
}

.button {
  grid-column: -2;
}
</style>
