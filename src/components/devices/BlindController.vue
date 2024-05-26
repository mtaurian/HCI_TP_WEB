<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { execute_device_action, get_device_state } from '@/api'

const props = defineProps<{
  device_id: string
}>()

type State = {
  status: 'opened' | 'opening' | 'closed' | 'closing'
  level: number
  currentLevel: number
}

const state = ref<State>((await get_device_state(props.device_id)).result as State)

async function update_state() {
  state.value = (await get_device_state(props.device_id)).result as State
}

const open = computed(() => {
  return state.value.status === 'opened' || state.value.status === 'opening'
})

const moving = computed(() => {
  return state.value.status === 'opening' || state.value.status === 'closing'
})

let interval: number | undefined
watch(
  () => moving.value,
  async () => {
    if (moving.value) {
      console.log('Starting interval')
      interval = setInterval(update_state, 1000)
    } else {
      console.log('Ending interval')
      clearInterval(interval)
    }
  },
  { immediate: true }
)

const height = ref(state.value.level ?? 0)

watch(height, () => {
  // Update the server with the new value
  execute_device_action(props.device_id, 'setLevel', [height.value])
})

async function click() {
  if (open.value) {
    await execute_device_action(props.device_id, 'close', [])
  } else {
    await execute_device_action(props.device_id, 'open', [])
  }

  update_state()
}
</script>

<template>
  <div>
    <div class="power-button">
      <v-btn
        @click="click"
        class="ma-2"
        :color="open ? 'green-lighten-2' : 'red-lighten-2'"
        height="80"
        width="80"
        variant="text"
        :disabled="moving"
      >
        <div class="iconPos">
          <v-icon :icon="open ? 'mdi-blinds-open' : 'mdi-blinds'" size="50" />
          {{ moving ? (open ? 'Opening...' : 'Closing...') : open ? 'Open' : 'Closed' }}
        </div>
      </v-btn>
    </div>
    <span class="span">Height</span>
    <v-slider
      class="slider"
      v-if="open && !moving"
      v-model="height"
      :min="0"
      :max="100"
      :step="1"
      thumb-label="always"
      color="primary"
      style="margin-right: 5%"
    >
      <template #thumb-label>
        <p class="text-accent">{{ height }}%</p>
      </template>
    </v-slider>
    <div class="progress" v-else-if="moving">
      <p>{{ state.status.charAt(0).toUpperCase() + state.status.slice(1) }}...</p>
      <v-progress-linear indeterminate active color="primary" bg-color="blue" />
    </div>
  </div>
</template>

<style>
.slider {
  margin-top: 2rem;
  margin-left: 3.5rem;
}
.span{
  margin-bottom: 20px;
}
</style>
