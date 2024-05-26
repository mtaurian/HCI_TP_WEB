<script setup lang="ts">

import { useHomeStore, useRoutineStore } from '@/stores'
import DeviceActionsByAction from '@/components/routines/DeviceActionsByAction.vue'
import { ref, watch, watchEffect } from 'vue'
import { type ApiActionToPost, type Device, get_device_type, get_routines, update_routine } from '@/api'

const routineStore = useRoutineStore();
const homeStore = useHomeStore();
const dialog = ref(false);
const emit = defineEmits(['delete', 'change_name']);
type rowType = {selectedDevice : Device, selectedAction : string, selectedActionParams : (string | number)[], actions : string[], id : number}
const rows = ref<rowType[]>([])
const changing_name = ref(false)
const new_name = ref(routineStore.routine?.name)
watchEffect( async () => {
  rows.value = []
  const actions = routineStore.routine?.actions || []

  // Utiliza Promise.all para manejar las acciones asíncronas
    let i = 0;
  const rowsData = await Promise.all(actions.map(async (action) => {
    i++;
    const deviceType = await get_device_type(action.device.type.id)
    return {
      selectedDevice: action.device,
      selectedAction: action.actionName,
      selectedActionParams: action.params,
      actions: deviceType.result?.actions.map((a) => a.name),
      id : Date.now() +i + Math.floor(Math.random() * 10000)
    }
  }))
  rows.value = rowsData
})

watch(() => routineStore.routine, () => {
  new_name.value = routineStore.routine?.name
  changing_name.value = false
})

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const addRow = async () => {
  rows.value.push({ selectedDevice: homeStore.devices[0], selectedAction: '', selectedActionParams :  [], actions: [''], id : Date.now() })
  await onUpdateDevice(homeStore.devices[0], rows.value.length - 1)
 scrollToSection('endOfRegion')
}

const handleDelete = (index : number) => {
  if(rows.value.length === 1 && index === 0){
    emit('delete')
  }
  rows.value.splice(index, 1);
}

const routines = (await get_routines()).result.map((r) => r.name)

console.log(routines)
const nameRules = [
  (v: string) => v.length <= 60 || 'Up to 60 characters',
  (v : string) => (v === routineStore.routine?.name || !routines.includes(v)) || 'The name is already in use',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Caracteres permitidos: a-z, A-Z, 0-9, _ y espacio',
]
const isValid = ref(false)
const validateNameChange = () => {
  isValid.value = nameRules.every((rule) => rule(new_name.value!) === true) && new_name?.value!.length > 0
}

const onSubmit = async () => {
  const theRoutineActions : ApiActionToPost[] = []
  rows.value.forEach((row) => {
    theRoutineActions.push(
      { device : {
          id : row.selectedDevice.id
        },
        actionName : row.selectedAction,
        params : row.selectedActionParams,
        meta : {}
      })
  })

  await  update_routine(routineStore.routine?.id!,routineStore.routine?.name!, theRoutineActions, {house_id : homeStore.home?.id!})

  //TODO un deshacer de la rutinas

  await homeStore.invalidate()
  await routineStore.setCurrentRoutine(routineStore.routine?.id!)


}

const handleResponse = (param : string | number | null | undefined, index : number, paramNbr : number) => {
  if (param !== null && param !== undefined){
    rows.value[index].selectedActionParams[paramNbr] = param;
  }
}


const onUpdateDevice = async (device: Device, index: number) => {
  rows.value[index].selectedDevice = device
  const deviceType = await get_device_type(device.type.id)
  rows.value[index].actions = deviceType.result?.actions.map((a) => a.name)
  rows.value[index].selectedAction = rows.value[index].actions[0]
}

const onUpdateAction = (action: string, index: number) => {
  rows.value[index].selectedAction = action
}

const handleUp = (index : number) => {
  if ( index === 0) return;

  const auxi = rows.value[index-1]
  rows.value[index-1] = rows.value[index]
  rows.value[index] = auxi;
}

const handleDown = (index : number) => {
  if ( index === rows.value.length-1) return;

  const auxi = rows.value[index+1]
  rows.value[index+1] = rows.value[index]
  rows.value[index] = auxi;

}



  const handleChangeName = async (newName : string) =>{
    const theActionsForPut = routineStore.routine?.actions.map(action => ({
      device: { id: action.device.id! },
      actionName: action.actionName,
      params: action.params,
      meta: action.meta
    })) || []
    await update_routine(routineStore.routine?.id!, newName, theActionsForPut, routineStore.routine?.meta!)
    await homeStore.invalidate()
    await routineStore.invalidate()
    await routineStore.setCurrentRoutine(routineStore.routine?.id!)
  }

</script>

<template>
  <div v-if="routineStore.routine" class="black-square">
      <div class="name" v-if="!changing_name">
        <h2>{{ routineStore.routine.name }}</h2>
          <v-btn variant="text" @click="changing_name = true">
            <template #prepend>
              <v-icon>mdi-pencil</v-icon>
            </template>
            Change name
          </v-btn>
      </div>
      <div class="change-name" v-else>
        <v-text-field
          v-model="new_name"
          @keydown.enter="() => {(changing_name = false); handleChangeName(new_name!)}"
          @keydown.esc="changing_name = false"
          :rules="nameRules"
          @update:modelValue="(val) => {new_name = val;  validateNameChange()}"
          variant="underlined"
          label="New name"
        ></v-text-field>
        <v-btn @click="() => {(changing_name = false); handleChangeName(new_name!)}" :disabled="!isValid" variant="flat">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn @click="changing_name = false" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="controller">
        <v-row  class="row" v-for="(row, index) in rows" :key="row.id" no-gutters>
          <!-- Columna 1: Select para elegir dispositivos -->
          <v-col cols="12" sm="3" class="column">
            <v-select
              class="item"
              v-model="rows[index].selectedDevice"
              :items="homeStore.devices"
              :item-value="item => item"
              :item-title="item => item.name + ' (' + item.room?.name + ')'"
              @update:modelValue="value => onUpdateDevice(value, index)"
              label="Select a Device"
              outlined
            ></v-select>
          </v-col>

          <!-- Columna 2: Select para elegir acciones -->
          <v-col cols="12" sm="3" class="column">
            <v-select
              class="item"
              v-model="rows[index].selectedAction"
              :items="rows[index].actions"
              @update:modelValue="value => onUpdateAction(value, index)"
              label="Select an action"
              outlined
            ></v-select>
          </v-col>

          <!-- Columna 3: Elemento que varía según la selección -->
          <v-col cols="12" sm="3" class="column">
            <div class="action">
              <DeviceActionsByAction
                :key="row.id + row.selectedAction + row.selectedDevice"
                :device_action-name="rows[index].selectedAction"
                :device_type_name="rows[index].selectedDevice.type.name"
                @response="(param) => handleResponse(param, index, 0)"
                @response2="(param) => handleResponse(param, index, 1)"
                :theParams="rows[index].selectedActionParams"
              />
            </div>
          </v-col>
            <v-fab icon="mdi-arrow-up-thin" size="sm" :disabled="index===0" @click="() => handleUp(index)" color="purple"/>
            <v-fab icon="mdi-arrow-down-thin" size="sm" :disabled="rows.length-1===index" @click="() => handleDown(index)" color="purple"/>
            <v-fab icon="mdi-delete" size="sm" :disabled="rows.length===1" @click="() => handleDelete(index)" color="purple"/>
        </v-row>
        <div id='endOfRegion'/>
      </div>
      <div class="editorButtons">
          <div class="flex">
            <div class="saveChanges">
              <v-btn @click="addRow" color="primary">Add Action</v-btn>
            </div>

          </div>
          <div class="button">
            <v-btn @click="dialog=true" color="submit">Save</v-btn>
            <v-btn class="cancel" color="primary" @click="() => homeStore.invalidate()">
              Cancel
            </v-btn>
        </div>
          <v-btn @click="() => emit('delete')" color="primary">
            <template #prepend>
              <v-icon>mdi-delete</v-icon>
            </template>
            Delete
          </v-btn>
      </div>
  </div>
  <div v-else>
    <p>
      ¡No hay rutina seleccionada! Tal vez una foto acá para decirle cómo agregar un
      dispositivo
    </p>
  </div>
  <template>
    <v-dialog
      theme="light"
      max-width="30rem"
      v-model="dialog"
      persistent
    >
      <v-card>
        <v-card-title>Confirm changes</v-card-title>
        <div class="dialog">
          <v-icon icon="mdi-alert" color="orange" size="large"/>
          <v-card-text>Are you sure you want change the {{routineStore.routine?.name}} from {{homeStore.home?.name}}?</v-card-text>
        </div>
        <div class="dialogActions">
          <v-card-actions>
            <v-btn  color="error" @click="()=> dialog = false">Cancel</v-btn>
            <v-btn color="primary" class="buttons" @click="()=> { onSubmit() ; dialog = false}">Confirm Changes</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </template>
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

@media screen and (max-width:1352px){
  .black-square  {
    padding: 2.2rem 0.8rem;
  }
}

.controller{
  overflow-y: auto;
  margin-top: 5.5rem;
  max-height: 28rem;
}

.actions {
  margin: 0 1rem;
}

.row{
  align-content: center;
  align-items: center;
  justify-items: center;
  margin-top: 10px;
  justify-content: space-between;
  border-width: 10px;
  padding-top : 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.column {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
}

.actions {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-items: center;
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
.select>* {
  width: 300px;
}

.flex{
  display: flex;
  flex-direction: row;
}
.actionsIcons{
  display : flex;
  flex-direction: row;
}

.change-name {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.name{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

@media screen and (max-width: 1352px) {
  .select>* {
    width: 200px;
  }
}

@media screen and (max-width: 768px) {
  .select>* {
    width: 150px;
  }
}

.saveChanges{
  margin-right: 1rem;
}

.editorButtons{
  margin-top: 3rem;
  grid-column: -2;
  align-items: end;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  margin-left: 2rem;
  margin-right: 2rem;
}

.button {
  margin-top: 3rem;
  grid-column: -2;
}
.cancel{
  margin-left: 1rem;
}
</style>
