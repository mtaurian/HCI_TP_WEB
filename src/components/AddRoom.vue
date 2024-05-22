<script setup lang="ts">
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/lib/labs/components.mjs';
import { ref, computed, type Ref } from 'vue';
import { add_room, add_room_to_home, type ApiError, type ApiMeta } from '@/api';
import { handleApiError } from '@/stores';
/**
 * Parametros del comoponente
 */
const props = defineProps<{
  dialog: boolean,
  code: string | null,
  homeId: string,
}>()

/**
 * Funciones de las que depende el comoponente
 */
const emit = defineEmits<{
  /**
 * Emits an event to turnOff de addroom element
 */
  turnoff: []
  /**
   * Emits an event to changeRoom 
  */
  changeroom: [string]
}>()
const isSwitchOn = ref(true);
const n = ref((props.code != null) ? 1 : 0)
const roomName = ref("CUARTO DE TOMI")
const houseCode = ref(null)
const roomAddress = ref(null)
const currentStep = ref(0);
const loading = ref(false)
const error: Ref<string | null> = ref(null)



function resetValues() {
  roomName.value = "CUARTO DE TOMI"
  houseCode.value = null
  roomAddress.value = null
  isSwitchOn.value = true
  currentStep.value = 1
  error.value = null
  loading.value = false
}

async function submit() {
  loading.value = true
  try {
    let newRoom;
    if (houseCode.value !== null && roomAddress.value != null) {
      newRoom = await add_room(roomName.value, { roomCode: houseCode.value, roomAddress: roomAddress.value })
    } else if (houseCode.value == null && roomAddress.value == null) {
      newRoom = await add_room(roomName.value, {})
    } else if (houseCode.value !== null) {
      newRoom = await add_room(roomName.value, { roomCode: houseCode.value })
    } else {
      newRoom = await add_room(roomName.value, { roomCode: houseCode.value })
    }
    add_room_to_home(props.homeId, newRoom.result.id)
    emit('changeroom', newRoom.result.id)

  } catch (e) {
    handleApiError(e, error)
  }
  setTimeout(() => { emit('turnoff'), resetValues() }, 3000);
}


const roomNameRules = [
  (v: string) => !!v || 'Obligatorio',
  (v: string) => (v && v.length >= 4 && v.length <= 20) || 'Debe contener 4-20 caracteres',
];

const isroomNameValid = computed(() => {
  console.log(props.code)
  return roomNameRules.every(rule => rule(roomName.value) === true);
});

const homeCodeRules = [
  (v: any) => !!v || 'Obligatorio',
  (v: any) => /^[0-9]*$/.test(v) || 'Debe ser un número',
  (v: any) => (v && v.length == 4) || 'Debe ser de 4 caracteres',
  (v: any) => v === props.code || 'Pin incorrecto',
];

const ishomeCodeValid = computed(() => {
  console.log(props.code)

  return homeCodeRules.every(rule => rule(houseCode.value) === true) && houseCode.value === props.code;
});

const isValidStepName = computed(() => isroomNameValid.value);
const isValidStepCode = computed(() => ishomeCodeValid.value);


</script>

<template>
  <v-dialog v-model="props.dialog" width="700">
    <v-card>
      <!--<v-icon color="success" icon="mdi-access-point" size="small"></v-icon>-->
      <v-stepper-vertical v-model=currentStep theme="light">
        <v-stepper-vertical-item v-if="props.code" :title="`Paso ${n}`" :value="n">
          <v-card title="Introduce el pin de seguridad de tu hogar" flat>
            <v-card-text>
              <v-text-field v-model="houseCode" label="Código" :rules="homeCodeRules" clearable placeholder="1234"
                suffix="Debe ser de 4 caracteres" />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepCode" @click="currentStep += 1" />
          </template>
        </v-stepper-vertical-item>

        <v-stepper-vertical-item :title="`Paso ${1 + n}`" :value="n + 1">
          <v-card title="Introduce un nombre para tu habitacion" flat>
            <v-card-text>
              <v-text-field required v-model="roomName" counter="20" :rules="roomNameRules" clearable label="Nombre"
                placeholder="CUARTO DE TOMI" hint="Entre 4-20 caracteres" />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepName" @click="currentStep += 1" />
          </template>

        </v-stepper-vertical-item>
        <v-stepper-vertical-item :title="`Paso ${2 + n}`" :value="n + 2">
          <v-card title="Intoduzca la ubicacion de su hogar" subtitle="Opcional" flat>
            <v-card>
              <v-card-text>
                <v-text-field ref="direccion" v-model="roomAddress" placeholder="Ayacucho 1375, CABA, Argentina" />
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :loading="loading" color="primary" text="Finish" @click="submit"></v-btn>
          </template>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
      <v-card v-if="error" color="error">{{ error }}</v-card>
      <v-btn @click="currentStep = 1, emit('turnoff'), resetValues()">Cancelar</v-btn>
    </v-card>
  </v-dialog>
</template>
