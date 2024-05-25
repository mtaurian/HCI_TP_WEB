<template>
  <main>
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <RoutinesList />
    </div>
    <div class="separator"></div>
    <div class="controller">
      <div>
        <RoutinesCreator />
      </div>
    </div>
    <v-dialog
      max-width="70rem"
      v-model="dialog"
      persistent
    >
      <AddRoutine
      @closed-or-canceled="() => dialog = false"
      />
    </v-dialog>
  </main>


  <v-fab class="v-fab" @click="onAddRoutine" size="x-large" extended color="white" prepend-icon="mdi-plus" text="Rutina"></v-fab>
</template>


<style scoped>
main {
  width: 100vw;
  height: calc(100vh - 100px); /* full screen - NavBar */
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

.v-fab {
  position: fixed; /* Change position to fixed */
  bottom: 5rem; /* Position it 16px from the bottom */
  right: 15rem; /* Position it 16px from the right */
  z-index: 1000; /* Ensure it is on top of other elements */
}

.list {
  display: flex;
  margin-top: 1%;
  justify-content: center;
  align-items: center;
}
</style>

<script setup lang="ts">
import RoutinesCreator from '@/components/routines/RoutinesCreator.vue'
import RoutinesList from '@/components/routines/RoutinesList.vue'
import AddRoutine from '@/components/routines/AddRoutine.vue'
import { ref } from 'vue'

const dialog = ref(false)
const onAddRoutine = () => {
  dialog.value = true
}
</script>
