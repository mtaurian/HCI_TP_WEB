<script setup lang="ts">
import { execute_routine, get_device_state, type Routine, update_device } from '@/api'
import { ref } from 'vue'
const FAUCETID = 'dbrlsh7o5sn8ur4i'
const props = defineProps<{
  routine: Routine
  isSelected: boolean
}>()

defineEmits<{
  click: [string]
}>()
type TheResultsType = {
  deviceName : string,
  actionName : string,
  done : boolean
}
const theResults = ref<TheResultsType[]>([])
const executedRoutine = ref(false)
const allRight = ref(false);
const handleExecute = async () => {
 /* NOTE: Sadly since the API does not always provide the pressure level and unit in the faucet state,
          we need to change the meta info manually when a routine contains faucets.
          this should not be necessary but in fact, is the only way we can assert changes
          to take effect even when faucet is closed.
 */

  //faucet region:
  const routine = props.routine;

  const promises = routine.actions.filter((a) => a.device.type.id === FAUCETID ).map(async action => {
    console.log('action:',action)
    const deviceCurrentSate = await get_device_state(action.device.id);
    if (deviceCurrentSate.result.status === 'opened') {
      await update_device(
        action.device.id,
        action.device.name,
        {
          ...action.device.meta,
          pressure: action.params[0],
          unit: action.params[1]
        }
      );
    }
  });
  await Promise.all(promises);
  //end faucet region;

  try {
    let results = await execute_routine(props.routine.id);
    routine.actions.forEach((act, index) => {
      theResults.value.push({deviceName : act.device.name, actionName : act.actionName, done : Boolean(results.result[index])})
    })
    console.log(theResults, results);
    if (results.result.filter((r) => !r).length === 0){
      allRight.value = true;
    }
    executedRoutine.value = true
  } catch (error){
    alert("something went wrong" )
    return;
  }

}

</script>

<template>
  <div class="container">
  <v-card class="pa-2" min-height="10vh" :color="isSelected ? 'focus' : ''" @click="$emit('click', routine.id)">
    <v-card-item >
      <template v-slot:title>
        <div class="flex">
            {{props.routine.name}}
          <v-btn icon="mdi-play" variant="tonal"
                 @click="handleExecute"/>
        </div>
      </template>
      <template v-slot:subtitle>
        <p class="capitalize">
          {{ props.routine.actions.length > 1 ? props.routine.actions.length + ' Registered actions' : '1 Registered action'  }}        </p>
      </template>
    </v-card-item>
  </v-card>
  </div>
  <v-dialog
    theme="light"
    max-width="30rem"
    v-model="executedRoutine"
    persistent
  >
    <v-card>
      <div class="cardDialogTitle">
        <v-icon icon="mdi-information" color="primary" size="large"/>
        <v-card-title>Routine Result</v-card-title>
      </div>
      <div class="dialog">
        <p>
          The "{{routine.name}}" routine has been correctly executed. {{allRight ? '' : ' Note that some of your actions couldn\'t ' +
          'run because the current state of your device was incompatible with the action.'}}
        </p>
        <br/>
        <p>
          <strong>
            Actions results:
          </strong>
        </p>
        <ul class="routineResults">
          <li v-for=" (r, idx) in theResults" :key="idx">
            {{
              'Device: ' + r.deviceName + ' - Action: ' +  r.actionName
            }} <v-icon :icon="r.done ? 'mdi-check' : 'mdi-close'" :color="r.done ? 'success' : 'error'"/>
          </li>
        </ul>
      </div>
      <div class="dialogActions">
        <v-card-actions class="dialogActions">
          <v-btn  color="primary" @click="()=> {theResults = [] ; executedRoutine = false}">Accept</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.capitalize::first-letter {
  text-transform: capitalize;
}
.flex{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.container{
  margin-right: 0.5rem;
}

.dialog {
  margin-left: 1.3rem;
  margin-bottom: 1rem;
}

.cardDialogTitle{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 1.3rem;
  margin-top: 1rem;
}
.routineResults{
  margin-left: 1.5rem;
}
.dialogActions{
  justify-content: right;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
