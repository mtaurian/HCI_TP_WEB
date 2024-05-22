<template>
  <v-select
    :items="modes"
    label="Device Mode"
    :item-value="item => item"
    :model-value="selectedMode"
    @update:modelValue="handleChange"
  />
</template>

<script setup lang="ts">
import { type ApiSong, execute_device_action } from '@/api/index.js'
import { ref } from 'vue'

const modes = ['Vacuum', 'Mop']
const emit = defineEmits(['mode-changed']);

const props = defineProps<{
  device_id : string,
  state : { result: Record<string, string | number | boolean | ApiSong[] | null> }
}>()

const capitalize = (str : string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const selectedMode = ref(capitalize(props.state.result.mode as string))

const handleChange = async (selected : string | null) => {
  if (!selected) return
  selectedMode.value = selected;
  selected = selected.toLowerCase()
  if(props.state.result.mode !== selected){
    await execute_device_action(props.device_id, 'setMode', [selected])
    emit('mode-changed');
  }
}


</script>