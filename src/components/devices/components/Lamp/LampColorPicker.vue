<template>
    <v-color-picker
      :model-value="currentColor"
      @update:model-value="handleOnChange"
      mode="rgba"
                    >
    </v-color-picker>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { type ApiReturns, execute_device_action } from '@/api'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

const currentColor = ref<string>(props.state.result.color as string)

enum PowerState {
  ON = 'on',
  OFF = 'off'
}

const isOn = computed(() => {
  return props.state.result.status === PowerState.ON
})

const emit = defineEmits(['color-changed'])

/**
 * If lamp is on, change color.
 * Else informs how to proceed.
 */
const handleOnChange = async (newColor: string) => {
  newColor = newColor.slice(1)
  currentColor.value = newColor
  if (isOn.value) {
    await execute_device_action(props.device_id, 'setColor', [newColor])
    emit('color-changed')
  }
}
</script>