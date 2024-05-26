<script setup lang="ts">
import { add_home, get_devices, get_homes } from '@/api'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import { handleApiError } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const isSwitchOn = ref(true)
const router=useRouter()
const route=useRoute()
const houseName = ref('')
const houseCode = ref(null)
const houseAddress = ref(null)
const currentStep = ref(1)
const loading = ref(false)
const error: Ref<string | null> = ref(null)
const housesNames= (await get_homes()).result.map((item) => item.name)
const dialog = ref(true)
defineProps<{
  mandatory?:boolean
}>()
watch(dialog, (value) => {
  if (!value) {
    emit('turnoff')
  }
})

const emit = defineEmits<{
  /**
   * Emits an event to turnoff the addHome element
   */
  turnoff: []

}>()
function resetValues() {
  houseName.value = ''
  houseCode.value = null
  houseAddress.value = null
  isSwitchOn.value = true
  currentStep.value = 1
  error.value = null
  loading.value = false
}
onMounted(() => {
  resetValues()
})

async function submit() {
  loading.value = true
  try {
    let newHome
    if (houseCode.value !== null && houseAddress.value != null) {
      newHome = await add_home(houseName.value, {
        houseCode: houseCode.value,
        houseAddress: houseAddress.value
      })
    } else if (houseCode.value == null && houseAddress.value == null) {
      newHome = await add_home(houseName.value, {})
    } else if (houseCode.value !== null) {
      newHome = await add_home(houseName.value, { houseCode: houseCode.value })
    } else {
      newHome = await add_home(houseName.value, { houseCode: houseCode.value })
    }

      await router.push(
        { name: route.name==='firststeps'? 'dashboard':route.name!,
          params: { home: newHome.result.id },
          query:{new_home:'true'}})

  } catch (e) {
    handleApiError(e, error)
  }
  setTimeout(() => {
    dialog.value = false
  }, error.value? 3000:1500)
}

const houseNameRules = [
  (v: string) => !!v || 'Obligatory',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Allowed characters: a-z, A-Z, 0-9, _ and space',
  (v: string) => (v && v.length >= 3 && v.length <= 60) || 'Must contain 3-60 characters',
  (v: string) => !housesNames.includes(v) || 'Another house with the same name already exists!'
]

const isHouseNameValid = computed(() => {
  return houseNameRules.every((rule) => rule(houseName.value) === true)
})

const houseCodeRules = [
  (v: any) => (isSwitchOn.value ? !!v || 'Obligatory' : true),
  (v: any) => (isSwitchOn.value ? /^[0-9]*$/.test(v) || 'Must be a number' : true),
  (v: any) => (isSwitchOn.value ? (v && v.length == 4) || 'Must be 4 characters long' : true)
]

const isHouseCodeValid = computed(() => {
  return houseCodeRules.every((rule) => rule(houseCode.value) === true)
})

const isValidStep1 = computed(() => isHouseNameValid.value)
const isValidStep2 = computed(() => !isSwitchOn.value || isHouseCodeValid.value)
</script>

<template>
  <v-dialog persistent v-model="dialog" width="50%">
    <v-card>
      <v-stepper-vertical v-model="currentStep" theme="light">
        <v-stepper-vertical-item title="House name" value="1" :complete="currentStep > 1">
          <v-card title="Enter a name for your house" flat>
            <v-card-text>
              <v-text-field
                required
                v-model="houseName"
                counter="60"
                :rules="houseNameRules"
                label="Name"
                placeholder="FIRST HOME"
                hint="Between 3-60 characters"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStep1" @click="currentStep++" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Security settings" value="2" :complete="currentStep > 2">
          <v-card title="Use your home security PIN for this device" flat>
            <v-card>
              <v-card-text>
                <v-switch v-model="isSwitchOn" label="Use PIN" color="primary" />
                <v-text-field
                  v-if="isSwitchOn"
                  v-model="houseCode"
                  label="PIN"
                  :rules=houseCodeRules
                  clearable
                  placeholder="1234"
                  suffix="Must be 4 characters long"
                />
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStep2" @click="currentStep++" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="House address" value="3" :complete="currentStep > 3">
          <v-card title="Enter your home address" subtitle="Optional" flat>
            <v-card>
              <v-card-text>
                <v-text-field
                  ref="Address"
                  v-model="houseAddress"
                  placeholder="Ayacucho 1375, CABA, Argentina"
                />
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :loading="loading" color="primary" text="Finish" @click="submit"></v-btn>
          </template>
        </v-stepper-vertical-item>
      </v-stepper-vertical>
      <v-card v-if="error" color="error">{{ error }}</v-card>
      <v-btn v-if="!mandatory" @click="dialog=false">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>
