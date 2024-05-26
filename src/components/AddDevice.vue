<script setup lang="ts">
import { add_device, get_devices } from '@/api'
import { computed, type Ref, ref, onMounted, watch } from 'vue'
import { handleApiError,useHomeStore, useRoomStore, useDeviceStore, usePinStore } from '@/stores'
import { get_device_types, add_device_to_room } from '@/api'

const deviceTypeSelect = ref('')
const deviceTypes = (await get_device_types()).result.map((item) => ({
  id: item.id,
  name: item.name.toUpperCase()
}))
const homeStore = useHomeStore()
const devicesNames = (await get_devices()).result.map((item) => item.name)
const pinStore=usePinStore()
const isProtected=pinStore.pin
const houseCode = ref(null)
const currentStep = ref(0)
const deviceName = ref('')
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const paired = ref(false)
const iconSelected = ref('')
const usePin=ref(false)

const roomStore = useRoomStore()
const deviceStore = useDeviceStore()

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
  usePin.value=false
  deviceTypeSelect.value = ''
  deviceName.value = ''
  currentStep.value = 0
  error.value = null
  loading.value = false
  paired.value = false
  iconSelected.value = ''
  houseCode.value = null
}

async function submit() {
  loading.value = true

  try {
    const newDevice = await add_device(deviceTypeSelect.value, deviceName.value, {
      deviceIcon: iconSelected.value, protected: usePin.value
    })
    await add_device_to_room(roomStore.room!?.id, newDevice.result.id)
    await roomStore.invalidate()
    await deviceStore.setCurrentDevice(newDevice.result.id)
    pinStore.validate(houseCode.value!)
  } catch (e) {
    handleApiError(e, error)
  }

  setTimeout(
    () => {
      dialog.value = false
    },
    error.value ? 3000 : 1500
  )
}

const deviceNameRules = [
  (v: string) => !!v || 'Obligatory',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Allowed characters: a-z, A-Z, 0-9, _ and space',
  (v: string) => (v && v.length >= 3 && v.length <= 60) || 'Must contain 3-60 characters',
  (v: string) => !devicesNames.includes(v) || 'Another device with the same name already exists!'
]

const homeCodeRules = [
  (v: any) => !!v || 'Obligatory',
  (v: any) => /^[0-9]*$/.test(v) || 'Must be a number',
  (v: any) => (v && v.length == 4) || 'Must be 4 characters long',
  (v: any) => isProtected===v || 'Incorrect PIN'
]
const ishomeCodeValid = computed(() => {
  return (
    homeCodeRules.every((rule) => rule(houseCode.value) === true)
  )
})
const isValidStepCode = computed(() => ishomeCodeValid.value)
const isDeviceNameValid = computed(() => {
  return deviceNameRules.every((rule) => rule(deviceName.value) === true)
})

const deviceTypeRules = [(v: any) => !!v || 'Obligatory']

const isDeviceTypeValid = computed(() => {
  return deviceTypeRules.every((rule) => rule(deviceTypeSelect.value) === true)
})

function buscarDispositivo() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    paired.value = true
  }, 2500)
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
    iconSelected.value = 'mdi-shield-lock'
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

onMounted(() => {
  resetValues()
})

const dialog = ref(true)
watch(dialog, (value) => {
  if (!value) {
    emit('turnoff')
  }
})
</script>

<template>
  <v-dialog v-model="dialog" width="50%">
    <v-card>
      <v-stepper-vertical v-model="currentStep" theme="light">
        <v-stepper-vertical-item
          v-if="isProtected"
          title="Security PIN"
          icon="mdi-numeric-1"
          :complete="currentStep >= 1"
        >
          <v-card title="Enter your home security PIN" flat>
            <v-card-text>
              <v-text-field
                v-model="houseCode"
                label="PIN"
                :rules="homeCodeRules"
                clearable
                placeholder="1234"
                suffix="Must be 4 characters long"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepCode" @click="currentStep += 1" />
          </template>
          <template v-slot:prev></template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item :title="`Device type`"
                                 :icon="isProtected ? 'mdi-numeric-2' : 'mdi-numeric-1'"
                                 :complete="isProtected ? currentStep > 1 : currentStep >= 1">
          <v-card title="Select the type of device" flat>
            <v-select
              label="Device"
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
          <template v-slot:prev></template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Link device"
                                 :icon="isProtected ? 'mdi-numeric-3' : 'mdi-numeric-2'"
                                 :complete="isProtected ? currentStep > 2 : currentStep >= 2">
          <v-card title="Find device" flat>
            <v-card flat>
              <v-card-text flat>
                <v-btn
                  :loading="loading"
                  :color="loading ? 'primary' : 'white'"
                  @click="buscarDispositivo"
                  v-if="!paired"
                >
                  FIND
                </v-btn>
                <v-card
                  v-else
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
        <v-stepper-vertical-item title="Device name"
                                 :icon="isProtected ? 'mdi-numeric-4' : 'mdi-numeric-3'"
                                 :complete="isProtected ? currentStep > 3 : currentStep >= 3">
          <v-card title="Enter a name for your device" flat>
            <v-card-text>
              <v-text-field
                v-model="deviceName"
                counter="60"
                :rules="deviceNameRules"
                clearable
                label="Name"
                placeholder="LIVING LAMP"
                hint="Between 3-60 characters"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepDeviceName" @click="currentStep += 1" />
          </template>
        </v-stepper-vertical-item>

        <v-stepper-vertical-item v-if="homeStore.home!.meta.houseCode" title="Security settings"
                                  :icon="isProtected ? 'mdi-numeric-5' : 'mdi-numeric-4'"
                                  :complete="isProtected ? currentStep > 4 : currentStep >= 4">
          <v-card title="Use your home security PIN for this device" flat>
            <v-switch v-model="usePin" label="Use PIN" color="primary" class="mx-3"/>
          </v-card>

          <template v-slot:next>
            <v-btn  @click="currentStep++" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item  title="Icon"
                                  :icon="(isProtected ? 'mdi-numeric-6' : (homeStore.home!.meta.houseCode? 'mdi-numeric-5':'mdi-numeric-4'))"
                                  :complete="isProtected ? currentStep > 5 : currentStep >= 5">
          <v-card title="Select an icon for your device" subtitle="Optional" flat>
            <v-card flat>
              <v-menu transition="scale-transition">
                <template v-slot:activator="{ props }">
                  <v-btn flat :prepend-icon="`${iconSelected}`" color="secondary" v-bind="props">
                    {{ deviceName }}
                  </v-btn>
                </template>
                <v-list width="600" height="400" style="overflow-x: hidden !important">
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
      <v-btn @click="dialog = false">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>
