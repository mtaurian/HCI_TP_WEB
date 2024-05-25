<template>
  <div class="title">
    <p class="font-weight-black" size="70">Mode</p>
  </div>
  <v-row>
    <v-col class="button">
      <v-btn
        @click="handleOnClick(Mode.COOL)"
        class="ma-2"
        :color="coolOn ? 'yellow' : 'white'"
        :size="50"
        variant="text"
      >
      <v-icon icon="mdi-snowflake" :size="50" />
      </v-btn>
      <v-label>Cool</v-label>
    </v-col>

    <v-col class="button">
      <v-btn
        @click="handleOnClick(Mode.HEAT)"
        class="ma-2"
        :color="heatOn ? 'yellow' : 'white'"
        :size="50"
        variant="text"
      >
        <v-icon icon="mdi-white-balance-sunny" :size="50" />
      </v-btn>
      <v-label>Heat</v-label>
    </v-col>

    <v-col class="button">
      <v-btn
        @click="handleOnClick(Mode.FAN)"
        class="ma-2"
        :color="fanOn ? 'yellow' : 'white'"
        :size="50"
        variant="text"
      >
      <v-icon icon="mdi-fan" :size="50" />
      </v-btn>
      <v-label>Fan</v-label>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ApiReturns, execute_device_action } from '@/api'

const props = defineProps<{
  state: { result: Record<string, ApiReturns> }
  device_id: string
}>()

enum Mode {
  COOL = 'cool',
  HEAT = 'heat',
  FAN = 'fan'
}

const coolOn = computed(() => {
  return props.state.result.mode === Mode.COOL
})

const heatOn = computed(() => {
  return props.state.result.mode === Mode.HEAT
})

const fanOn = computed(() => {
  return props.state.result.mode === Mode.FAN
})

const emit = defineEmits(['mode-changed'])

const handleOnClick = async (newMode: Mode) => {
  await execute_device_action(props.device_id, 'setMode', [newMode])
  emit('mode-changed')
}
</script>

<style scoped>
.title{
  margin-bottom: 10px;
}
.button{
  display : flex;
  margin-right: 20px;
  justify-content: center;
  justify-items: center;
}

</style>