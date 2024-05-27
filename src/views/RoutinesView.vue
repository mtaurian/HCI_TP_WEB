<template>
  <main :class="routineStore.routine? 'main':'routinless'" v-if="homeStore.devices.length">
    <!-- <h1>House code: {{ $route.params.home }}<br />Room code: {{ $route.params.room }}</h1> -->
    <div class="list">
      <RoutinesList />
    </div>
    <div :class="routineStore.routine ? 'separator' : ''"></div>

    <div class="controller">
      <div class="placeHolder">
        <RoutinesCreator @delete="() => (deleteDialog = true)" v-if="routineStore.routine" />
        <div v-else class="routinless">
          <img class="no_routine" src="/no_routine.png" alt="No routine"/>
          <h2>No routines available! Try adding one to get started!</h2>
        </div>
      </div>
      <div class="fab">
        <v-btn
          height="50"
          rounded
          @click="onAddRoutine"
          size=""
          color="white"
          prepend-icon="mdi-plus"
          text="ROUTINE"
          width="150"
        />
      </div>
    </div>

    <v-dialog max-width="70rem" v-model="dialog" persistent>
      <AddRoutine @closed-or-canceled="() => (dialog = false)" />
    </v-dialog>
    <v-dialog theme="light" max-width="30rem" v-model="deleteDialog" persistent>
      <v-card>
        <div class="cardDialogTitle">
          <v-icon icon="mdi-alert" color="orange" size="large" />
          <v-card-title>Confirm Delete</v-card-title>
        </div>
        <div class="dialog">
          <p>
            Are you sure you want delete "{{ routineStore.routine?.name }}" from "{{
              homeStore.home?.name
            }}"?
          </p>
        </div>
        <div>
          <v-card-actions class="dialogActions">
            <v-btn color="primary" @click="() => (deleteDialog = false)">Cancel</v-btn>
            <v-btn
              color="error"
              class="buttons"
              @click="
                () => {
                  handleDelete()
                  deleteDialog = false
                }
              "
            >
              Delete
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </main>
  <div class="deviceless" v-else>
    <p>This house doesn't have devices!</p>
    <p>In order to use the routines, you need at least one device</p>
  </div>
</template>

<style scoped>
main {
  width: 100vw;
  height: calc(100vh - 100px); /* full screen - NavBar */
  display: grid;
  grid-template-columns: 30% 2px 1fr;
}

.deviceless {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.no_routine{
  max-height: 42%;
  max-width: 42%;
}
.separator {
  background-color: #4a4458;
  margin: 1rem 0;
  opacity: 0.5;
}
.routinless{
  display: flex;
  justify-content: left;
  flex-direction: column;
  align-items: center;
}

.controller {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.controller > .placeHolder {
  width: 95%;
  height: 80%;
}

@media screen and (max-width: 1440px) {
  .controller > .placeHolder {
    width: 98%;
    height: 80%;
  }
}

.dialog {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.cardDialogTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1.3rem;
  margin-top: 1rem;
}

.dialogActions {
  justify-content: right;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.main {
  overflow: hidden;
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
const deleteDialog = ref(false)

const onAddRoutine = () => {
  dialog.value = true
}

const handleDelete = async () => {
  await delete_routine(routineStore.routine?.id!)
  await homeStore.invalidate()

  if (homeStore.routines.length) {
    routineStore.setCurrentRoutine(homeStore.routines[0].id)
  } else {
    routineStore.routine = null
  }
}
</script>
