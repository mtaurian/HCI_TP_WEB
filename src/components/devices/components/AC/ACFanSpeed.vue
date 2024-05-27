<template>
  <div class="title">
    <span class="span">Fan Speed</span>
  </div>
  <v-col class="d-flex justify-space-around">
    <v-btn-toggle
      v-model="fanSpeed"
      color="deep-purple-accent-3"
      rounded="0"
      :disabled="isAuto"
      @update:model-value="handleOnClick"
      group
    >
      <v-btn value="25">
        25
      </v-btn>

      <v-btn value="50">
        50
      </v-btn>

      <v-btn value="75">
        75
      </v-btn>

      <v-btn value="100">
        100
      </v-btn>
    </v-btn-toggle>
    </v-col>
    <v-col>
      <v-switch label="Auto" inset color="primary" v-model="auto" @update:model-value="handleOnClick('auto')"/>
    </v-col>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { type ApiReturns, execute_device_action } from '@/api'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

const fanSpeed = ref(props.state.result.fanSpeed as string)
const auto = ref(props.state.result.fanSpeed === 'auto')

const isAuto = computed(() => auto.value)

const emit = defineEmits(['speed-changed'])

const handleOnClick = async (newSpeed: string) => {
  await execute_device_action(props.device_id, 'setFanSpeed', [newSpeed])
  emit('speed-changed')
}
</script>

<style scoped>
.title{
  margin-bottom: 1rem;
}
.span{
  margin-bottom: 2rem;
}
</style>