<template>
  <div class="title">
    <span class="span">Vertical Swing</span>
  </div>
  <v-row>
    <v-col class="slider">
      <v-slider
        v-model="verticalSwing"
        width="400"
        :min="0"
        :max="tickLabels.length - 1"
        show-ticks="always"
        step="1"
        :tick-size="tickLabels.length"
        color="primary"
        @update:model-value="handleOnChange"
        :disabled="isAuto"
        :thumb-label="!isAuto ? 'always' : false"
      >
        <template #thumb-label>
          <p class="text-accent" >{{ tickLabels[verticalSwing as number] }}°</p>
        </template>
      </v-slider>
    </v-col>
    <v-col>
      <v-switch
        label="Auto"
        inset color="primary"
        v-model="isAuto"
        @update:model-value="handleAutoOnChange"
      />
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

const emit = defineEmits(['vertical-slider'])

const isAuto = ref(props.state.result.verticalSwing === 'auto')

const tickLabels = ['22', '45', '67', '90']

const verticalSwing = ref(isAuto.value ? 0 : tickLabels.indexOf(props.state.result.verticalSwing as string))

const handleOnChange = async (newValue: number) => {
  await execute_device_action(props.device_id, 'setVerticalSwing', [tickLabels[newValue]])
  emit('vertical-slider')
}

const handleAutoOnChange = async () => {
  if(isAuto.value){
    await execute_device_action(props.device_id, 'setVerticalSwing', ['auto'])
    emit('vertical-slider')
  } else {
    await execute_device_action(props.device_id, 'setVerticalSwing', [tickLabels[verticalSwing.value]])
    emit('vertical-slider')
  }
}
</script>

<style scoped>
.title{
  margin-bottom: 3rem;
}
.slider{
  display : flex;
  margin-left: 1.5rem;
  margin-right: 2rem;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  gap: 1rem;
}
.span{
  margin-bottom: 2rem;
}

</style>