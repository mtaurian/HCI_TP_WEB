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

      await router.push({ name: route.name==='firststeps'? 'dashboard':route.name!, params: { home: newHome.result.id } })

  } catch (e) {
    handleApiError(e, error)
  }
  setTimeout(() => {
    dialog.value = false
  }, error.value? 3000:1500)
}

const houseNameRules = [
  (v: string) => !!v || 'Obligatorio',
  (v: string) => /^[a-zA-Z0-9_ ]*$/.test(v) || 'Caracteres permitidos: a-z, A-Z, 0-9, _ y espacio',
  (v: string) => (v && v.length >= 3 && v.length <= 60) || 'Debe contener 3-60 caracteres',
  (v: string) => !housesNames.includes(v) || 'Another house with the same name already exists!'
]

const isHouseNameValid = computed(() => {
  return houseNameRules.every((rule) => rule(houseName.value) === true)
})

const houseCodeRules = [
  (v: any) => (isSwitchOn.value ? !!v || 'Obligatorio' : true),
  (v: any) => (isSwitchOn.value ? /^[0-9]*$/.test(v) || 'Debe ser un número' : true),
  (v: any) => (isSwitchOn.value ? (v && v.length == 4) || 'Debe ser de 4 caracteres' : true)
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
        <v-stepper-vertical-item title="Paso 1" value="1" :complete="currentStep > 1">
          <v-card title="Introduce un nombre para tu hogar" flat>
            <v-card-text>
              <v-text-field
                required
                v-model="houseName"
                counter="60"
                :rules="houseNameRules"
                label="Nombre"
                placeholder="CASA 1"
                hint="Entre 3-60 caracteres"
              />
            </v-card-text>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStep1" @click="currentStep++" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Paso 2" value="2" :complete="currentStep > 2">
          <v-card title="Pin de seguridad" flat>
            <v-card>
              <v-card-text>
                <v-switch v-model="isSwitchOn" label="Usar código" color="primary" />
                <v-text-field
                  v-if="isSwitchOn"
                  v-model="houseCode"
                  label="Código"
                  :rules="[
                    (v) => /^[0-9]*$/.test(v) || 'Debe ser un numero',
                    (v) => (v && v.length == 4) || 'Debe ser de 4 caracteres'
                  ]"
                  clearable
                  placeholder="1234"
                  suffix="Debe ser de 4 caracteres"
                />
              </v-card-text>
            </v-card>
          </v-card>
          <template v-slot:next>
            <v-btn :disabled="!isValidStep2" @click="currentStep++" />
          </template>
        </v-stepper-vertical-item>
        <v-stepper-vertical-item title="Paso 3" value="3" :complete="currentStep > 3">
          <v-card title="Intoduzca la ubicacion de su hogar" subtitle="Opcional" flat>
            <v-card>
              <v-card-text>
                <v-text-field
                  ref="direccion"
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
      <v-btn v-if="!mandatory" @click="dialog=false">Cancelar</v-btn>
    </v-card>
  </v-dialog>
</template>
