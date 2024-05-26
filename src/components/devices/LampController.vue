<template>
  <div class="rows">
    <v-col class="power">
        <PowerButton
          class="colPower"
          v-if="state"
          :device_id="props.device_id"
          :state="state"
          @power-changed="updateDeviceState"
        />
    </v-col>
    <v-col>

        <BrigthnessSlider
          class="colSlider"
          v-if="state"
          :device_id="props.device_id"
          :state="state"
          @color-changed="updateDeviceState"

        />
    </v-col>
    <v-col>

          <ColorPicker
            class="colPicker"
            v-if="state"
            :device_id="props.device_id"
            :state="state"
            @color-changed="updateDeviceState"
          />
    </v-col>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type ApiReturns, get_device_state } from '@/api'
import PowerButton from '@/components/devices/components/Lamp/LampOnOff.vue'
import ColorPicker from '@/components/devices/components/Lamp/LampColorPicker.vue'
import BrigthnessSlider from '@/components/devices/components/Lamp/LampSlider.vue'

const props = defineProps<{
  device_id: string
}>()

const state = ref<{  result: Record<string, ApiReturns>; }>()

const updateDeviceState = async () => {
  state.value = await get_device_state(props.device_id)
}

onMounted(async () => {
  await updateDeviceState()
  setInterval(updateDeviceState, 60000) // update state every minute
})
</script>

<style>
.rows {
  width: 100%;
  display: flex;
  justify-content: center; /* Centra los elementos horizontalmente */
  align-items: center; /* Centra los elementos verticalmente */
  align-content: center;
  height: 100%; /* Ajusta al 100% de la altura de la ventana */
}

.colPower, .colSlider, .colPicker {
  margin: 0 5px; /* Margen entre los elementos */
}

.colPower, .colSlider {
  flex: 2; /* Se expanden igualmente */
  width: 10%; /* Ancho máximo */
}

.colPicker {
  flex: 2; /* Se expande el doble que los otros */
  width: 80%; /* Ancho máximo */
}
.power{
  display: flex;
  justify-content: center; /* Centra los elementos horizontalmente */
  align-items: center; /* Centra los elementos verticalmente */
  align-content: center;
}
</style>