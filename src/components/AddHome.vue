<script setup lang="ts">
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/lib/labs/components.mjs';
import { ref, computed } from 'vue';
import { add_home, type ApiError, type ApiMeta } from '@/api';
import { useRouter } from 'vue-router'

const isSwitchOn = ref(true);

const houseName = ref("CASA 1")
const houseCode = ref(null)
const houseAddress = ref(null)
const currentStep = ref(1);
const loading = ref(false)
const error = ref(false)
const errorDescription = ref("Error inesperado")
const router = useRouter()
const props = defineProps<{
  dialog: boolean,
}>()
const emit = defineEmits<{
  /**
 * Emits an event to turnOff the addHome element
 */
  turnoff: []

  /**
   * Emits an event to changeHome
   */
  changehome: [string]


}>()
function resetValues() {
  houseName.value = "CASA 1"
  houseCode.value = null
  houseAddress.value = null
  isSwitchOn.value = true
  currentStep.value = 1
  error.value = false
  loading.value = false
}

async function submit() {
  loading.value = true
  try {
    let newHome;
    if (houseCode.value !== null && houseAddress.value != null) {
      newHome = await add_home(houseName.value, { houseCode: houseCode.value, houseAddress: houseAddress.value })
    } else if (houseCode.value == null && houseAddress.value == null) {
      newHome = await add_home(houseName.value, {})
    } else if (houseCode.value !== null) {
      newHome = await add_home(houseName.value, { houseCode: houseCode.value })
    } else {
      newHome = await add_home(houseName.value, { houseCode: houseCode.value })
    }
    console.log(newHome.result.id)
    emit('changehome', newHome.result.id)
    //await router.push({
    // name: 'dashboard',
    //params: {
    // home: newHome!!.result.id
    // }
    //})
  } catch (e) {
    error.value = true
  }
  setTimeout(() => { emit('turnoff'), resetValues() }, 2000);
}


const houseNameRules = [
  (v: string) => !!v || 'Obligatorio',
  (v: string) => (v && v.length >= 4 && v.length <= 20) || 'Debe contener 4-20 caracteres'
];

const isHouseNameValid = computed(() => {
  return houseNameRules.every(rule => rule(houseName.value) === true);
});

const houseCodeRules = [
  (v: any) => isSwitchOn.value ? !!v || 'Obligatorio' : true,
  (v: any) => isSwitchOn.value ? /^[0-9]*$/.test(v) || 'Debe ser un número' : true,
  (v: any) => isSwitchOn.value ? (v && v.length == 4) || 'Debe ser de 4 caracteres' : true
];

const isHouseCodeValid = computed(() => {
  return houseCodeRules.every(rule => rule(houseCode.value) === true);
});

const isValidStep1 = computed(() => isHouseNameValid.value);
const isValidStep2 = computed(() => !isSwitchOn.value || isHouseCodeValid.value);


</script>

<template>
  <!--<v-btn prepend-icon="mdi-plus" @click="dialog = true">
    Crear una casa
  </v-btn>-->
  <v-dialog v-model="props.dialog" width="700">
    <v-card>
      <v-stepper-vertical v-model=currentStep theme="light">
        <v-stepper-vertical-item title="Paso 1" value="1">
          <v-card title="Introduce un nombre para tu hogar" flat>
            <v-card-text>
              <v-text-field required v-model="houseName" counter="20" :rules="houseNameRules" label="Nombre"
                placeholder="CASA 1" hint="Entre 4-20 caracteres" />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStep1" @click="currentStep++" />
          </template>

        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Paso 2" value="2">
          <v-card title="Pin de seguridad" flat>
            <v-card>
              <v-card-text>
                <v-switch v-model="isSwitchOn" label="Usar código" color="primary" />
                <v-text-field v-if="isSwitchOn" v-model="houseCode" label="Código"
                  :rules="[v => /^[0-9]*$/.test(v) || 'Must be a number', (v) => (v && v.length == 4) || 'Debe ser de 4 caracteres']"
                  clearable placeholder="1234" suffix="Debe ser de 4 caracteres" />
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStep2" @click="currentStep++" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Paso 3" value="3">
          <v-card title="Intoduzca la ubicacion de su hogar" subtitle="Opcional" flat>
            <v-card>
              <v-card-text>
                <v-text-field ref="direccion" v-model="houseAddress" placeholder="Ayacucho 1375, CABA, Argentina" />
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :loading="loading" color="primary" text="Finish" @click="submit"></v-btn>
          </template>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
      <v-card v-if="error" color="error">{{ errorDescription }}</v-card>
      <v-btn @click="currentStep = 1, emit('turnoff')">Cancelar</v-btn>
    </v-card>
  </v-dialog>
</template>
