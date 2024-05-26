<template>
  <main>
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <RoutinesList />
    </div>
    <div class="separator"></div>

    <div class="controller">
      <div>
        <RoutinesCreator
        @delete="() => deleteDialog = true"
        />
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
    <v-dialog
      theme="light"
      max-width="30rem"
      v-model="deleteDialog"
      persistent
    >
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <div class="dialog">
          <v-icon icon="mdi-alert" color="orange" size="large"/>
          <v-card-text>Are you sure you want delete "{{routineStore.routine?.name}}" from "{{homeStore.home?.name}}"?</v-card-text>
        </div>
        <div class="dialogActions">
          <v-card-actions>
            <v-btn  color="error" @click="()=> deleteDialog = false">Cancel</v-btn>
            <v-btn color="primary" class="buttons" @click="()=> { handleDelete() ; deleteDialog = false}">Delete</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </main>


  <v-fab class="v-fab" @click="onAddRoutine" size="x-large" extended color="white" prepend-icon="mdi-plus" text="Routine"></v-fab>
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
  width: 95%;
  height: 80%;
}
@media screen and (max-width:1440px){
  .controller > div {
    width: 98%;
    height: 80%;
  }
}

.dialog {
  display: flex;
  flex-direction: row;
  gap : 1.5rem;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  align-items: center;
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
import { delete_routine } from '@/api'
import { useHomeStore, useRoutineStore } from '@/stores'
const routineStore = useRoutineStore()
const homeStore = useHomeStore()
const dialog = ref(false)
const deleteDialog = ref(false);

const onAddRoutine = () => {
  dialog.value = true
}

const handleDelete = async () =>{
  await delete_routine(routineStore.routine?.id!);
  await homeStore.invalidate()
}

</script>
