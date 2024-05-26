<script setup lang="ts">
import OpenClose from './components/Faucet/OpenClose.vue'
import DispenseButton from './components/Faucet/DispenseButton.vue'
import DispenseOptions from './components/Faucet/DispenseOptions.vue'

import { ref, watch } from 'vue'
import { get_device_state } from '@/api'

const props = defineProps<{
  device_id: string
}>()

type State = {
  status: 'opened' | 'closed'
  quantity?: number
  unit?: 'ml' | 'cl' | 'dl' | 'l' | 'dal' | 'hl' | 'kl'
  dispensedQuantity?: number
}

const state = ref<State>((await get_device_state(props.device_id)).result as State)

const dispensing = ref(false)

async function update_state() {
  state.value = (await get_device_state(props.device_id)).result as State
}

watch(
  () => state.value,
  async () => {
    if (state.value?.quantity) {
      dispensing.value = true
    } else {
      dispensing.value = false
    }
  },
  { immediate: true }
)

let interval: number | undefined
watch(
  () => dispensing.value,
  async () => {
    if (dispensing.value) {
      console.log('Starting interval')
      interval = setInterval(update_state, 1000)
    } else {
      console.log('Ending interval')
      clearInterval(interval)
    }
  },
  { immediate: true }
)

const amount = ref(0)
const unit = ref('ml')

function dispense_change(a: number, u: string) {
  console.log('Dispense change', a, u)
  amount.value = a
  unit.value = u
}
</script>

<template>
  <div class="controls">
    <div class="buttons">
      <OpenClose
        :device_id
        :status="state.status"
        :dispensing="!!state?.quantity"
        @click="update_state"
      />
      <DispenseButton
        :device_id
        :status="state.status"
        :dispensing="!!state?.quantity"
        :amount
        :unit
        @click="update_state"
      />
    </div>
    <DispenseOptions
      :dispensing="!!state.quantity"
      :progress="((state?.dispensedQuantity ?? 0) / (state?.quantity ?? 1)) * 100"
      @change="dispense_change"
    />
  </div>
</template>

<style scoped>
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;

  width: 100%;
  margin-bottom: 5%;
}
</style>
