<template>
  <div class="power-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="!isOpen || dispensing ? 'green-lighten-2' : 'red-lighten-2'"
      height="80"
      width="80"
      variant="text"
      :disabled="dispensing || isOpen"
    >
      <div class="iconPos">
        <v-icon icon="mdi-water-pump" size="50" />
        {{ dispensing ? 'Dispensing' : 'Dispense' }}
      </div>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { execute_device_action } from '@/api'

const props = defineProps<{
  status: 'opened' | 'closed'
  amount: number
  unit: string
  dispensing: boolean
  device_id: string
}>()

const isOpen = computed(() => {
  return props.status === 'opened'
})

const emit = defineEmits(['click'])

const handleOnClick = async () => {
  console.log('Dispense button clicked', props.amount, props.unit)
  await execute_device_action(props.device_id, 'dispense', [props.amount, props.unit])
  emit('click')
}
</script>

<style scoped>
.power-button {
  display: flex;
  margin-right: 20px;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
}
.iconPos {
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centra los elementos horizontalmente */
  align-items: center; /* Centra los elementos verticalmente */
  align-content: center;
}
</style>
