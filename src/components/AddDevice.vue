<script setup lang="ts">
import { add_device, add_home } from '@/api'
import { computed, type Ref, ref } from 'vue'
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/lib/labs/components.mjs';
import { handleApiError } from '@/stores'
import { get_device_types, add_device_to_room } from '@/api'

const deviceTypeSelect = ref('')
const deviceTypes = ref(await get_device_types()).value.result.map((item) => ({
  id: item.id,
  name: item.name.toUpperCase()
}))
const currentStep = ref(0)
const deviceName = ref('')
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const paired = ref(false)
const iconSelected = ref('')

const props = defineProps<{
  dialog: boolean
  roomId: string
}>()

const emit = defineEmits<{
  /**
   * Emits an event to turnOff the addHome element
   */
  turnoff: []
}>()

const icons = [
  'airballoon',
  'airplane',
  'album',
  'alphabetical',
  'apps',
  'bank',
  'barley',
  'beach',
  'bed',
  'bed-queen',
  'beaker',
  'beer',
  'bike',
  'binoculars',
  'bone',
  'bookmark',
  'bowling',
  'briefcase',
  'broom',
  'brush',
  'bug',
  'bulletin-board',
  'bullhorn',
  'cake',
  'calculator',
  'calendar',
  'camera',
  'candycane',
  'car',
  'carrot',
  'cart',
  'cash',
  'cast',
  'castle',
  'cat',
  'cellphone',
  'church',
  'city',
  'clipboard',
  'clippy',
  'clock',
  'close',
  'cloud',
  'coffee',
  'compass',
  'compass-outline',
  'cow',
  'crown',
  'cup',
  'details',
  'diamond',
  'dice-1',
  'dice-2',
  'dice-3',
  'dice-4',
  'dice-5',
  'dice-6',
  'drawing',
  'drone',
  'duck',
  'dumbbell',
  'emoticon',
  'emoticon-cool',
  'emoticon-devil',
  'emoticon-happy',
  'emoticon-neutral',
  'emoticon-poop',
  'emoticon-sad',
  'emoticon-tongue',
  'eraser',
  'escalator',
  'factory',
  'fan',
  'fire',
  'fireplace-off',
  'fish',
  'flashlight',
  'flashlight-off',
  'flower',
  'folder',
  'food-variant',
  'football',
  'fridge',
  'gamepad',
  'gamepad-variant',
  'gas-station',
  'gavel',
  'gift',
  'glass-mug',
  'glass-tulip',
  'glasses',
  'grid',
  'guitar-pick',
  'hanger',
  'headphones',
  'garage',
  'sofa',
  'television',
  'weight-lifter',
  'baby-face-outline'
]
function resetValues() {
  deviceTypeSelect.value = ''
  deviceName.value = ''
  currentStep.value = 0
  error.value = null
  loading.value = false
  paired.value = false
  iconSelected.value = ''
}
async function submit() {
  loading.value = true
  try {
    const newDevice = await add_device(deviceTypeSelect.value, deviceName.value, {
      deviceIcon: iconSelected.value
    })
    await add_device_to_room(props.roomId, newDevice?.result.id)
  } catch (e) {
    handleApiError(e, error)
  }
  setTimeout(
    () => {
      emit('turnoff'), resetValues()
    },
    error.value ? 3000 : 1500
  )
}

const deviceNameRules = [
  (v: string) => !!v || 'Obligatorio',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Caracteres permitidos: a-z, A-Z, 0-9, _ y espacio',
  (v: string) => (v && v.length >= 3 && v.length <= 60) || 'Debe contener 3-60 caracteres'
]

const isDeviceNameValid = computed(() => {
  return deviceNameRules.every((rule) => rule(deviceName.value) === true)
})

const deviceTypeRules = [(v: any) => !!v || 'Obligatorio']

const isDeviceTypeValid = computed(() => {
  return deviceTypeRules.every((rule) => rule(deviceTypeSelect.value) === true)
})
function buscarDispositivo() {
  loading.value = true
  setTimeout(() => {
    ;(loading.value = false), (paired.value = true)
  }, 3000)
}
function setIcon() {
  if (deviceTypeSelect.value == deviceTypes[0].id) {
    iconSelected.value = 'mdi-speaker'
  } else if (deviceTypeSelect.value == deviceTypes[1].id) {
    iconSelected.value = 'mdi-faucet'
  } else if (deviceTypeSelect.value == deviceTypes[2].id) {
    iconSelected.value = 'mdi-blinds'
  } else if (deviceTypeSelect.value == deviceTypes[3].id) {
    iconSelected.value = 'mdi-lamp'
  } else if (deviceTypeSelect.value == deviceTypes[4].id) {
    iconSelected.value = 'mdi-stove'
  } else if (deviceTypeSelect.value == deviceTypes[5].id) {
    iconSelected.value = 'mdi-air-conditioner'
  } else if (deviceTypeSelect.value == deviceTypes[6].id) {
    iconSelected.value = 'mdi-lock'
  } else if (deviceTypeSelect.value == deviceTypes[7].id) {
    iconSelected.value = 'mdi-acctv'
  } else if (deviceTypeSelect.value == deviceTypes[8].id) {
    iconSelected.value = 'mdi-vacuum'
  } else if (deviceTypeSelect.value == deviceTypes[9].id) {
    iconSelected.value = 'mdi-fridge-outline'
  } else {
    iconSelected.value = 'mdi-icon'
  }
}
function getNameDevicePaired(): string {
  if (deviceTypeSelect.value == deviceTypes[0].id) {
    return 'JBL-Flip 6'
  } else if (deviceTypeSelect.value == deviceTypes[1].id) {
    return 'FERRUM-K150W'
  } else if (deviceTypeSelect.value == deviceTypes[2].id) {
    return 'ROLLET MARKET-BO'
  } else if (deviceTypeSelect.value == deviceTypes[3].id) {
    return 'PHILIPS HUE'
  } else if (deviceTypeSelect.value == deviceTypes[4].id) {
    return 'WHIRLPOOL-GRILL-1000'
  } else if (deviceTypeSelect.value == deviceTypes[5].id) {
    return 'SPLIT PHILCO-INVERTER'
  } else if (deviceTypeSelect.value == deviceTypes[6].id) {
    return 'TEDEE GO-LOCK'
  } else if (deviceTypeSelect.value == deviceTypes[7].id) {
    return 'GADNIC DM200W'
  } else if (deviceTypeSelect.value == deviceTypes[8].id) {
    return 'XIAOMI E10'
  } else if (deviceTypeSelect.value == deviceTypes[9].id) {
    return 'SAMSUMG RT32K5070'
  } else {
    return ''
  }
}

const isValidStepDeviceType = computed(() => isDeviceTypeValid.value)
const isValidStepDeviceName = computed(() => isDeviceNameValid.value)
</script>

<template>
  <v-dialog v-model="props.dialog" width="700">
    <v-card>
      <v-stepper-vertical v-model="currentStep" theme="light">
        <v-stepper-vertical-item title="Paso 1" icon="mdi-numeric-1" :complete="currentStep > 0">
          <v-card title="Selecciona el tipo de dispositivo" flat>
            <v-select
              label="Dispositivo"
              v-model="deviceTypeSelect"
              :items="deviceTypes"
              item-title="name"
              item-value="id"
              variant="solo-filled"
            >
            </v-select>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepDeviceType" @click="currentStep++, setIcon()" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Paso 2" icon="mdi-numeric-2" :complete="currentStep > 1">
          <v-card title="Vincular dispositvo" flat>
            <v-card>
              <v-card-text>
                <v-btn
                  :loading="loading"
                  :color="loading ? 'primary' : 'white'"
                  @click="buscarDispositivo"
                  >Buscar</v-btn
                >
                <v-card
                  v-if="paired"
                  append-icon="mdi-check"
                  flat
                  color="green"
                  :title="getNameDevicePaired()"
                ></v-card>
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!paired" @click="currentStep++" />
          </template>
          <template v-slot:prev>
            <v-btn @click="currentStep--, (paired = false)" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Paso 3" icon="mdi-numeric-3" :complete="currentStep > 2">
          <v-card title="Introduce un nombre para tu dispositivo" flat>
            <v-card-text>
              <v-text-field
                v-model="deviceName"
                counter="20"
                :rules="deviceNameRules"
                clearable
                label="Nombre"
                placeholder="LAMPARA LIVING"
                hint="Entre 3-60 caracteres"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepDeviceName" @click="currentStep += 1" />
          </template>
        </v-stepper-vertical-item>

        <v-stepper-vertical-item title="Paso 4" icon="mdi-numeric-4" :complete="currentStep > 3">
          <v-card title="Seleccione un icono para su dispositivo" subtitle="Opcional" flat>
            <v-card>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn flat :prepend-icon="`${iconSelected}`" color="secondary" v-bind="props">
                    {{ deviceName }}
                  </v-btn>
                </template>
                <v-list class="my-card">
                  <v-row>
                    <v-col v-for="(item, index) in icons" :key="index" cols="3">
                      <v-list-item>
                        <v-btn
                          @click="iconSelected = `mdi-${item}`"
                          :icon="`mdi-${item}`"
                          flat
                        ></v-btn>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-list>
              </v-menu>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn
              :loading="loading"
              :color="error ? 'error' : 'primary'"
              text="Finish"
              @click="submit"
            ></v-btn>
          </template>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
      <v-card v-if="error" color="error">{{ error }}</v-card>
      <v-btn @click="emit('turnoff'), resetValues()">Cancelar</v-btn>
    </v-card>
  </v-dialog>
</template>
