<template>
  <div class="temp-input">
    <p class="font-weight-black" size="70">Temperature</p>
    <v-number-input
      :min="18"
      :max="38"
      :model-value="temperature"
      control-variant="split"
      @update:model-value="(val: number) => handleOnChange(val)"
    ></v-number-input>
  </div>
</template>

<script setup lang="ts">
import { type ApiReturns, execute_device_action } from '@/api'
import { ref } from 'vue'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

const emit = defineEmits(['temp-changed'])

const temperature = ref(props.state.result.temperature as number)

const handleOnChange = async (newTemperature: number) => {
  temperature.value = newTemperature
  await execute_device_action(props.device_id, 'setTemperature', [newTemperature])
  emit('temp-changed')
}

</script>

<style scoped>
.temp-input{
  display : flex;
  margin-right: 20px;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}

</style>