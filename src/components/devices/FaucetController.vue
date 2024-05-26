<script setup lang="ts">
import { ref, watch } from 'vue'
import { execute_device_action, update_device, type ApiReturns } from '@/api'

const props = defineProps<{
  device_id: string
  device_name: string
  open: boolean | ApiReturns
  meta:
    | {
        pressure: number | ApiReturns
        unit: 'ml' | 'cl' | 'dl' | 'l' | 'dal' | 'hl' | 'kl' | ApiReturns
      }
    | Record<string, unknown>
}>()

const open = ref(props.open as boolean)
const pressure = ref((props.meta.pressure as number) ?? 0)
const unit = ref((props.meta.unit as 'ml' | 'cl' | 'dl' | 'l' | 'dal' | 'hl' | 'kl') ?? 'ml')

watch(open, async () => {
  if (open.value) {
    await execute_device_action(props.device_id, 'open', [])
  } else {
    await execute_device_action(props.device_id, 'close', [])
  }
})

watch([pressure, unit], async () => {
  // Update the server with the new value only if the faucet is open
  if (open.value) {
    await execute_device_action(props.device_id, 'dispense', [pressure.value, unit.value])
  }

  // Remember the last values in case the user opens the faucet
  await update_device(props.device_id, props.device_name, {
    // If something in the meta breaks, this might be the issue
    ...props.meta,
    pressure: pressure.value,
    unit: unit.value
  })
})
</script>

<template>
  <v-switch :label="open ? 'Abierto' : 'Cerrado'" inset color="primary" v-model="open" />
  <!-- We don't disable the slider in case the user wants to change the settings _before_ opening the tap -->
  <div class="slider">
    <v-slider
      label="Presión"
      v-model="pressure"
      :min="1"
      :max="100"
      :step="1"
      :disabled="!open"
      thumb-label="always"
      color="primary"
    >
      <template #thumb-label>
        <p class="text-accent">{{ pressure }}%</p>
      </template>
    </v-slider>
    <div class="unit">
      <v-select
        v-model="unit"
        :items="['ml', 'cl', 'dl', 'l', 'dal', 'hl', 'kl']"
        variant="outlined"
        :disabled="!open"
      />
    </div>
  </div>
</template>

<style scoped>
.slider {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.slider > .unit {
  width: 100px;
}
</style>
