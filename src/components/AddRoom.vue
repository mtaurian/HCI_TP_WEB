<script setup lang="ts">
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/lib/labs/components.mjs'
import { ref, computed, type Ref } from 'vue'
import { add_room, add_room_to_home, type ApiError, type ApiMeta } from '@/api'
import { handleApiError } from '@/stores'
/**
 * Parametros del comoponente
 */
const props = defineProps<{
  dialog: boolean
  code: string | null
  homeId: string
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
const icons = [
  "airballoon",
  "airplane",
  "album",
  "alphabetical",
  "apps",
  "bank",
  "barley",
  "beach",
  "bed",
  "bed-queen",
  "beaker",
  "beer",
  "bike",
  "binoculars",
  "bone",
  "bookmark",
  "bowling",
  "briefcase",
  "broom",
  "brush",
  "bug",
  "bulletin-board",
  "bullhorn",
  "cake",
  "calculator",
  "calendar",
  "camera",
  "candycane",
  "car",
  "carrot",
  "cart",
  "cash",
  "cast",
  "castle",
  "cat",
  "cellphone",
  "church",
  "city",
  "clipboard",
  "clippy",
  "clock",
  "close",
  "cloud",
  "coffee",
  "compass",
  "compass-outline",
  "cow",
  "crown",
  "cup",
  "details",
  "diamond",
  "dice-1",
  "dice-2",
  "dice-3",
  "dice-4",
  "dice-5",
  "dice-6",
  "drawing",
  "drone",
  "duck",
  "dumbbell",
  "emoticon",
  "emoticon-cool",
  "emoticon-devil",
  "emoticon-happy",
  "emoticon-neutral",
  "emoticon-poop",
  "emoticon-sad",
  "emoticon-tongue",
  "eraser",
  "escalator",
  "factory",
  "fan",
  "fire",
  "fireplace-off",
  "fish",
  "flashlight",
  "flashlight-off",
  "flower",
  "folder",
  "food-variant",
  "football",
  "fridge",
  "gamepad",
  "gamepad-variant",
  "gas-station",
  "gavel",
  "gift",
  "glass-mug",
  "glass-tulip",
  "glasses",
  "grid",
  "guitar-pick",
  "hanger",
  "headphones",
  "garage",
  "sofa",
  "television",
  "weight-lifter",
  "baby-face-outline"
]

// const n = ref(props.code != null ? 0 : 1)
const roomName = ref('')
const houseCode = ref(null)
const currentStep = ref(0)
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const iconSelected = ref('mdi-bed')

function resetValues() {
  roomName.value = ''
  houseCode.value = null
  currentStep.value =  0
  error.value = null
  loading.value = false
  iconSelected.value='mdi-bed'
}

async function submit() {
  loading.value = true
  try {
    let newRoom
    newRoom = await add_room(roomName.value, { roomIcon: iconSelected.value })
    await add_room_to_home(props.homeId, newRoom.result.id)
    emit('changeroom', newRoom.result.id)
  } catch (e) {
    handleApiError(e, error)
  }
  setTimeout(() => {
    emit('turnoff'), resetValues()
  }, (error? 3000:1500))
}

const roomNameRules = [
  (v: string) => !!v || 'Obligatorio',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Caracteres permitidos: a-z, A-Z, 0-9, _ y espacio',
  (v: string) => (v && v.length >= 3 && v.length <= 60) || 'Debe contener 3-60 caracteres'
]

const isroomNameValid = computed(() => {
  console.log(props.code)
  return roomNameRules.every((rule) => rule(roomName.value) === true)
})

const homeCodeRules = [
  (v: any) => !!v || 'Obligatorio',
  (v: any) => /^[0-9]*$/.test(v) || 'Debe ser un número',
  (v: any) => (v && v.length == 4) || 'Debe ser de 4 caracteres',
  (v: any) => v === props.code || 'Pin incorrecto'
]

const ishomeCodeValid = computed(() => {
  console.log(props.code)

  return (
    homeCodeRules.every((rule) => rule(houseCode.value) === true) && houseCode.value === props.code
  )
})

const isValidStepName = computed(() => isroomNameValid.value)
const isValidStepCode = computed(() => ishomeCodeValid.value)
</script>

<template>
  <v-dialog v-model="props.dialog" width="700">
    <v-card>
      <!--<v-icon color="success" icon="mdi-access-point" size="small"></v-icon>-->
      <v-stepper-vertical v-model="currentStep" theme="light">
        <v-stepper-vertical-item v-if="props.code" title="Paso 1" :editable="currentStep==0" :complete="currentStep>=1">
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

        <v-stepper-vertical-item :title="`Paso ${(props.code? '2':'1')}`" :editable="(props.code? currentStep==1:currentStep==0)" :complete="(props.code? currentStep>1:currentStep>=1)">
          <v-card title="Introduce un nombre para tu habitacion" flat>
            <v-card-text>
              <v-text-field v-model="roomName" counter="20" :rules="roomNameRules" clearable label="Nombre"
                placeholder="CUARTO DE TOMI" hint="Entre 3-60 caracteres" />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepName" @click="currentStep += 1" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item :title="`Paso ${(props.code? '3':'2')}`" :editable="(props.code? currentStep==2:currentStep==1)">
          <v-card title="Seleccione un icono para su habitacion" subtitle="Opcional" flat>
            <v-card>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn flat  :prepend-icon="`${iconSelected? iconSelected: 'mdi-icon'}`" color="secondary" v-bind="props">
                    {{roomName}}
                  </v-btn>
                </template>
                <v-list class="my-card">
                  <v-row>
                    <v-col v-for="(item, index) in icons" :key="index" cols="3">
                      <v-list-item>
                        <v-btn @click="iconSelected=`mdi-${item}`" :icon="`mdi-${item}`" flat></v-btn>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>
              </v-menu>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :loading="loading" :color="error? 'error': 'primary'" text="Finish" @click="submit"></v-btn>
          </template>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
      <v-card v-if="error" color="error">{{ error }}</v-card>
      <v-btn @click="emit('turnoff'), resetValues()">Cancelar</v-btn>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.my-card {
  width: 450px;
  max-height: 400px;
  margin: 0;
}
</style>