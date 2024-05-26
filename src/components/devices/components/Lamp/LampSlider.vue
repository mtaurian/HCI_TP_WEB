<template>
<div class="devices">
  <v-label><strong>Brightness</strong></v-label>
    <v-slider
      direction="vertical"
      v-model="brightness"
      :min="0"
      :max="100"
      :step="1"
      thumb-label="always"
      color="primary"
      @update:model-value="handleOnChange"
    >
      <template #thumb-label>
        <p class="text-accent">{{ brightness }}%</p>
      </template>
    </v-slider>
  </div>
</template>

<script setup lang="ts">
import { type ApiReturns, execute_device_action } from '@/api'
import { ref } from 'vue'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

const emit = defineEmits(['brightness-slider'])

const brightness = ref((props.state.result.brightness as number) ?? 0)

const handleOnChange = async () => {
  console.log(brightness.value);
  await execute_device_action(props.device_id, 'setBrightness', [brightness.value])
  emit('brightness-slider')
}
</script>
<style>
.slider{
  display : flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
</style>