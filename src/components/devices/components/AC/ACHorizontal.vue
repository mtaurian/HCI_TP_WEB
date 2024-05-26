<template>
  <div class="title">
    <span class="span">Horizontal Swing</span>
  </div>
  <v-row>
    <v-col class="slider">
      <v-slider
        v-model="horizontalSwing"
        width="400"
        :min="-90"
        :max="90"
        :step="45"
        :thumb-label="!isAuto ? 'always' : false"
        color="primary"
        @update:model-value="handleOnChange"
        :disabled="isAuto"
      >
        <template #thumb-label>
          <p class="text-accent">{{ horizontalSwing }}°</p>
        </template>
      </v-slider>
    </v-col>
    <v-col>
      <v-switch
        label="Auto"
        inset color="primary"
        v-model="isAuto"
        @update:model-value="handleAutoOnChange"/>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { type ApiReturns, execute_device_action } from '@/api'
import { ref } from 'vue'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

const emit = defineEmits(['horizontal-slider'])

const isAuto = ref(props.state.result.horizontalSwing === 'auto')

const horizontalSwing = ref(isAuto.value ? '-90' : props.state.result.horizontalSwing as string)

const handleOnChange = async (newValue: string | number) => {
  const newHorizontalSwing = typeof newValue === 'number' ? newValue.toString() : newValue;
  await execute_device_action(props.device_id, 'setHorizontalSwing', [newHorizontalSwing])
  emit('horizontal-slider')
}

const handleAutoOnChange = async () => {
  if(isAuto.value){
    await execute_device_action(props.device_id, 'setHorizontalSwing', ['auto'])
    emit('horizontal-slider')
  } else {
    await execute_device_action(props.device_id, 'setHorizontalSwing', [horizontalSwing.value.toString()])
    emit('horizontal-slider')
  }
}

</script>

<style scoped>
.title{
  margin-bottom: 1rem;
}
.slider{
  display : flex;
  margin-left: 0.5rem;
  margin-right: 2rem;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
.span{
  margin-bottom: 2rem;
}

</style>