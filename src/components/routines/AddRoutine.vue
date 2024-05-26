<!-- eslint-disable vue/valid-v-slot -->

<template>
  <v-stepper  class="stepper" max-width="70rem" theme="light" :items="steps" hide-actions v-model="currentStep">
    <template v-slot:item.1>
      <v-card title="Step One" flat>
        <v-select
          v-model="selectedHome"
          :items="allHousesStore.homes"
          :item-value="item => item.id"
          :item-title="item => item.name"
          label="Select home"
        />
        <v-text-field
          v-model="routineName"
          :rules="rules"
          label="Enter a name for the new routine"
          outlined
          :counter="60"
          @input="validateForm"
        />
        <div class="actions">
          <v-btn color="error" class="cancel" @click="() => dialog = true">Cancel</v-btn>
          <div>
            <v-btn class="buttons" color="secondary" :disabled="!isValid" @click="onNext">Next</v-btn>
          </div>
        </div>
      </v-card>
    </template>

    <template v-slot:item.2>
      <v-card title="Configuration"  flat>
        <v-container class="container">
          <v-row class="row" v-for="(row, index) in rows" :key="row.id" no-gutters>
            <!-- Columna 1: Select para elegir dispositivos -->
            <v-col cols="12" sm="3" class="column">
              <v-select
                class="item"
                v-model="row.selectedDevice"
                :items="devices"
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
                v-model="row.selectedAction"
                :items="row.actions"
                @update:modelValue="value => onUpdateAction(value, index)"
                label="Select an action"
                outlined
              ></v-select>
            </v-col>

            <!-- Columna 3: Elemento que varía según la selección -->
            <v-col cols="12" sm="3" class="column">
              <div class="action">
                <DeviceActionsByAction
                  :device_action-name="row.selectedAction"
                  :device_type_name="row.selectedDevice.type.name"
                  @response="(param) => handleResponce(param, index, 0)"
                  @response2="(param) => handleResponce(param, index, 1)"
                />
              </div>
            </v-col>
            <v-fab icon="mdi-arrow-up-thin" size="sm" :disabled="index===0" @click="() => handleUp(index)" color="purple"/>
            <v-fab icon="mdi-arrow-down-thin" size="sm" :disabled="rows.length-1===index" @click="() => handleDown(index)" color="purple"/>
            <v-fab icon="mdi-delete" size="sm" :disabled="rows.length===1" @click="() => handleDelete(index)" color="purple"/>
          </v-row>
        </v-container>
          <div id="endOfRegion2"/>
        <v-btn class="ma-4" @click="addRow" color="primary">Add Action</v-btn>
        <div class="actions">
          <v-btn color="error" class="cancel" @click="() => dialog = true">Cancel</v-btn>
          <div>
            <v-btn color="white" class="buttons" border @click="onPrevious">Previous</v-btn>
            <v-btn color="secondary" class="buttons" @click="onNext">Next</v-btn>
          </div>
        </div>
      </v-card>
    </template>

    <template v-slot:item.3>
      <v-card title="Step Three" flat></v-card>
      <p>Are you sure you want to create the "{{routineName}}" routine for  "{{selectedHome?.name}}"?</p>
      <p>Please keep in mind that if the devices you selected have a security pin assigned, this will be requested when executing the routine.</p>
      <div class="actions">
        <v-btn color="error" class="cancel" @click="() => dialog = true">Cancel</v-btn>
        <div >
        <v-btn class="buttons" color="white" border @click="onPrevious">Previous</v-btn>
        <v-btn class="buttons" color="primary" @click="onSubmit">Confirm</v-btn>
        </div>
      </div>
    </template>
  </v-stepper>
  <template>
      <v-dialog
        theme="light"
        max-width="30rem"
        v-model="dialog"
        persistent
        >
        <v-card>
          <v-card-title>Confirm cancel</v-card-title>
          <div class="dialog">
            <v-icon icon="mdi-alert" color="orange" size="large"/>
            <v-card-text>Are you sure you want to cancel?</v-card-text>
          </div>
          <div class="dialogActions">
            <v-card-actions>
              <v-btn border class="buttons" @click="()=> dialog = false">Back to editor</v-btn>
              <v-btn border class="buttons" @click="() => {dialog = false; emit('closedOrCanceled')}">Confirm Cancel</v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-dialog>
  </template>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAllHousesStore, useHomeStore } from '@/stores'
import { add_routine, type ApiActionToPost, type Device, get_device_type, get_routines } from '@/api'
import DeviceActionsByAction from '@/components/routines/DeviceActionsByAction.vue'

const steps = ref(['Home & Name', 'Actions!', 'Confirm'])
const currentStep = ref(1)
const emit = defineEmits(['closedOrCanceled']);
const allHousesStore = useAllHousesStore()
const homeStore = useHomeStore()
const devices = homeStore.devices
const routineName = ref('')
const isValid = ref(false)
const dialog = ref(false);
const selectedHome = ref(homeStore.home)
const routines = (await get_routines()).result.map((r) => r.name)

type rowType = {selectedDevice : Device, selectedAction : string, selectedActionParams : (string | number)[], actions : string[], id : number}

const rows = ref<rowType[]>([
  { selectedDevice: devices[0], selectedAction: '', selectedActionParams : [] ,actions: [''] , id : Date.now()},
])

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

const addRow = async () => {
  rows.value.push({ selectedDevice: devices[0], selectedAction: '', selectedActionParams :  [], actions: [''] , id : Date.now()})
  await onUpdateDevice(devices[0], rows.value.length - 1)
  scrollToSection('endOfRegion2')
}

const onNext = () => {
  currentStep.value++
}
const onPrevious = () => {
  currentStep.value--
}

const handleDelete = (index : number) => {
    rows.value.splice(index, 1);
}

const rules = [
  (v: string) => v.length <= 60 || 'Up to 60 characters',
  (v : string) => !routines.includes(v) || 'The name is already in use',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Caracteres permitidos: a-z, A-Z, 0-9, _ y espacio',
]

const validateForm =  () => {
  isValid.value = rules.every((rule) => rule(routineName.value) === true) && routineName.value.length > 0
}

const onSubmit = () => {
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

  add_routine(routineName.value, theRoutineActions, {house_id : selectedHome.value?.id})
 //TODO un deshacer de la rutinas

  homeStore.invalidate();
  emit('closedOrCanceled')
}

const handleResponce = (param : string | number | null | undefined, index : number, paramNbr : number) => {
  if (param !== null && param !== undefined){
    rows.value[index].selectedActionParams[paramNbr] = param;
  }
  console.log(rows)
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


onMounted(() => {
  onUpdateDevice(devices[0], 0)
  validateForm()  // Para asegurar la validación inicial
})
</script>

<style scoped>
.column {
  margin-right: 1rem;
  margin-left: 1rem;
}

.row {
  background-color: #e8e8e8;
  align-content: center;
  align-items: center;
  justify-items: center;
  margin-top: 10px;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.item {
  margin-top: 1.5rem;
}

.container {
  overflow-y: auto;
  max-height: 30rem;
  justify-content: space-between;
}

.actions {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-top: 2rem;
  justify-content: space-between;
}


.buttons{
  margin-right: 1rem;
}

.dialog{
  display: flex;
  flex-direction: row;
  gap : 1.5rem;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.action{
  margin-top: 1.5rem;
}
</style>
