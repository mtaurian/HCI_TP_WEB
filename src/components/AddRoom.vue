<script setup lang="ts">
import { ref, computed, type Ref, watch, onMounted } from 'vue'
import { add_room, add_room_to_home, get_rooms } from '@/api'
import { handleApiError, useHomeStore, usePinStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

/**
 * Parametros del comoponente
 */
const props = defineProps<{
  code: string | null
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
const homeStore = useHomeStore()
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
const dialog = ref(true)
watch(dialog, (value) => {
  if (!value) {
    emit('turnoff')
  }
})
const pinStore=usePinStore()
const roomsNames=(await get_rooms()).result.map((item) => item.name)
const router=useRouter()
const route=useRoute()
const roomName = ref('')
const isProtected=pinStore.pin
const houseCode = ref(null)
const currentStep = ref(0)
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const iconSelected = ref('mdi-bed')

function resetValues() {
  roomName.value = ''
  houseCode.value = null
  currentStep.value = 0
  error.value = null
  loading.value = false
  iconSelected.value = 'mdi-bed'
}
onMounted(() => {
  resetValues()
})
async function submit() {
  loading.value = true
  try {
    let newRoom
    newRoom = await add_room(roomName.value, { roomIcon: iconSelected.value })
    await add_room_to_home(homeStore.home!?.id, newRoom.result.id)
    await router.push({ name: 'dashboard', params: { home: route.params.home, room:newRoom.result.id } })
    pinStore.validate(houseCode.value!)
  } catch (e) {
    handleApiError(e, error)
  }
  setTimeout(
    () => {
      dialog.value=false
    },
    error.value ? 3000 : 1500
  )
}

const roomNameRules = [
  (v: string) => !!v || 'Obligatory',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Allowed characters: a-z, A-Z, 0-9, _ and space',
  (v: string) => (v && v.length >= 3 && v.length <= 60) || 'Must contain 3-60 characters',
  (v: string) => !roomsNames.includes(v) || 'Another room with the same name already exists!'
]

const isroomNameValid = computed(() => {
  console.log(props.code)
  return roomNameRules.every((rule) => rule(roomName.value) === true)
})

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

const isValidStepName = computed(() => isroomNameValid.value)
const isValidStepCode = computed(() => ishomeCodeValid.value)
</script>

<template>
  <v-dialog v-model="dialog" width="50%">
    <v-card>
      <!--<v-icon color="success" icon="mdi-access-point" size="small"></v-icon>-->
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
                suffix="Must be 4 characters long"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepCode" @click="currentStep += 1" />
          </template>
          <template v-slot:prev></template>
        </v-stepper-vertical-item>

        <v-stepper-vertical-item
          title="Room name"
          :icon="isProtected ? 'mdi-numeric-2' : 'mdi-numeric-1'"
          :complete="isProtected ? currentStep > 1 : currentStep >= 1"
        >
          <v-card title="Enter a name for your room" flat>
            <v-card-text>
              <v-text-field
                v-model="roomName"
                counter="60"
                :rules="roomNameRules"
                clearable
                label="Name"
                placeholder="FIRST ROOM"
                hint="Between 3-60 characters"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStepName" @click="currentStep += 1" />
          </template> <template v-slot:prev></template>

        </v-stepper-vertical-item>
        <v-stepper-vertical-item
          :title="`Paso ${isProtected ? '3' : '2'}`"
          :icon="isProtected ? 'mdi-numeric-3' : 'mdi-numeric-2'"
        >
          <v-card title="Select an icon for your device" subtitle="Optional" flat>
            <v-card>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    flat
                    :prepend-icon="`${iconSelected ? iconSelected : 'mdi-icon'}`"
                    color="secondary"
                    v-bind="props"
                  >
                    {{ roomName }}
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
      <v-btn @click="dialog=false">Cancel</v-btn>
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
