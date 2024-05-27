<script setup lang="ts">
import { actionsReadableNames, execute_routine, type Routine } from '@/api'
import { ref, watch } from 'vue'
import { usePinStore } from '@/stores'
const props = defineProps<{
  routine: Routine
  isSelected: boolean
}>()

defineEmits<{
  click: [string]
}>()
type TheResultsType = {
  deviceName: string
  actionName: string
  done: boolean | null
}

const confirmDialog = ref<boolean>(false)
const theResults = ref<TheResultsType[]>([])
const executedRoutine = ref(false)
const allRight = ref(false)

watch(executedRoutine, () => {
  if (!executedRoutine.value) {
    theResults.value = []
  }
})

const pinStore = usePinStore()
const protectedDevices = ref<string[]>([])
const pinDialog = ref<boolean>(false)
const valid_pin = ref(false)
const seeReferences = ref(false)

const handleSecurity = () => {
  const routine = props.routine
  /* SECURITY PIN:
     The routine will execute based on the state of the pinStore,
     meaning that if the PIN has already been request before
     the executing of the routine will not ask for it again.
     Otherwise, the routine will first request the home PIN once.
   */
  if (pinStore.pin) {
    protectedDevices.value = routine.actions
      .filter((a) => a.device.meta.protected)
      .map((a) => a.device.name)
    if (protectedDevices.value.length > 0) {
      pinDialog.value = true
    }
  } else {
    handleExecute()
  }
}

const on_pin_change = (pin: string) => {
  if (pinStore.validate(pin)) {
    pinDialog.value = false
    handleExecute()
  }
}

const handleExecute = async () => {
  const routine = props.routine

  try {
    let results = await execute_routine(props.routine.id)
    routine.actions.forEach((act, index) => {
      theResults.value.push({
        deviceName: act.device.name,
        actionName: actionsReadableNames[act.actionName as keyof typeof actionsReadableNames],
        done: results.result[index]
      })
    })
    console.log(theResults, results)
    if (results.result.filter((r) => r === false).length === 0) {
      allRight.value = true
    }
    executedRoutine.value = true
  } catch (error) {
    alert('something went wrong')
    return
  }
}
</script>

<template>
  <div class="container">
    <v-card
      class="card"
      min-height="10vh"
      :color="isSelected ? 'focus' : ''"
      @click="$emit('click', routine.id)"
    >
      <v-card-item>
        <div class="flex">
          {{ props.routine.name }}
        </div>
        <template v-slot:title> </template>
        <template v-slot:subtitle>
          <p class="capitalize">
            {{
              props.routine.actions.length > 1
                ? props.routine.actions.length + ' Registered actions'
                : '1 Registered action'
            }}
          </p>
        </template>
      </v-card-item>
      <div class="executeBtn">
        <v-btn prepend-icon="mdi-play" variant="tonal" @click="confirmDialog = true" color="white"
          >Execute</v-btn
        >
      </div>
    </v-card>
  </div>

  <v-dialog theme="light" max-width="30rem" v-model="confirmDialog" persistent>
    <v-card>
      <div class="cardDialogTitle">
        <v-icon icon="mdi-sitemap" color="orange" size="large" />
        <v-card-title>Confirm Routine Run</v-card-title>
      </div>
      <div class="dialog">
        <p>Are you sure you want to run "{{ routine.name }}" routine?</p>
      </div>
      <div class="dialogActions">
        <v-card-actions class="dialogActions">
          <v-btn color="secondary" @click="() => (confirmDialog = false)">Cancel</v-btn>
          <v-btn
            color="primary"
            class="buttons"
            @click="
              () => {
                confirmDialog = false
                handleSecurity()
              }
            "
            >Run Routine</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog theme="light" max-width="30rem" v-model="pinDialog" persistent>
    <v-card>
      <div class="cardDialogTitle">
        <v-icon icon="mdi-security" color="blue" size="large" />
        <v-card-title>Security PIN Required</v-card-title>
      </div>
      <div class="dialog">
        <p>
          The "{{ routine.name }}" routine is PIN protected. To continue, please insert the PIN.
        </p>
      </div>
      <v-otp-input
        :length="4"
        :error="!valid_pin"
        variant="outlined"
        @finish="pinStore.validate"
        @update:model-value="on_pin_change"
      />
      <div class="dialogActions">
        <v-card-actions class="dialogActions">
          <v-btn color="error" @click="() => (pinDialog = false)">Cancel</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog theme="light" max-width="30rem" v-model="executedRoutine">
    <v-card>
      <div class="cardDialogTitle">
        <v-icon icon="mdi-information" color="primary" size="large" />
        <v-card-title>Routine Result</v-card-title>
      </div>
      <div class="dialog">
        <p>
          The "{{ routine.name }}" routine has been correctly executed.
          {{
            allRight
              ? ''
              : " Note that some of your actions couldn't " +
                'run because the current state of your device was incompatible with the action.'
          }}
        </p>
        <br />
        <p>
          <strong> Actions results: </strong>
        </p>
        <div class="divRoutineResults">
          <ul class="routineResults">
            <li v-for="(r, idx) in theResults" :key="idx + Math.floor(Math.random() * 1000)">
              {{ 'Device: ' + r.deviceName + ' - Action: ' + r.actionName }}
              <v-icon
                :icon="r.done ? 'mdi-check' : r.done === false ? 'mdi-close' : 'mdi-equal'"
                :color="r.done ? 'success' : r.done === false ? 'error' : 'blue'"
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="ml-4">
        <div class="referencesIconTitle" @click="seeReferences = !seeReferences" aria-hidden="true">
          <v-icon :icon="seeReferences ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          <p><strong>References</strong></p>
        </div>
        <div v-if="seeReferences">
          <ul class="routineReference">
            <li><v-icon icon="mdi-check" color="success" />Action run with success</li>
            <li><v-icon icon="mdi-equal" color="blue" />Device was already in the request state</li>
            <li>
              <v-icon icon="mdi-close" color="error" />Device current state was found incompatible
              with the request action
            </li>
          </ul>
        </div>
      </div>
      <div class="dialogActions">
        <v-card-actions class="dialogActions">
          <v-btn
            color="primary"
            @click="
              () => {
                theResults = []
                executedRoutine = false
              }
            "
            >Accept</v-btn
          >
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.capitalize::first-letter {
  text-transform: capitalize;
}
.flex {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  justify-items: center;
}
.container {
  margin-right: 0.5rem;
}

.dialog {
  margin-left: 1.3rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
}

.cardDialogTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1.3rem;
  margin-top: 1rem;
}
.routineResults {
  margin-left: 1.5rem;
}
.divRoutineResults {
  overflow-y: auto;
  max-height: 20vh;
}

.routineReference {
  margin-left: 2rem;
}

.referencesIconTitle {
  flex-direction: row;
  display: flex;
  cursor: pointer;
}
.dialogActions {
  justify-content: right;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.executeBtn {
  margin-right: 1rem;
}
</style>
