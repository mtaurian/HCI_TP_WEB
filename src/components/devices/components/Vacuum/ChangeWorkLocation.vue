<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
    persistent
  >
    <template v-slot:activator="{}">
      <v-select
        :items="roomNames"
        label="Working Location"
        :model-value="selectedLocation"
        @update:modelValue="handleChange"
      />
    </template>

    <v-card
      prepend-icon="mdi-map-marker"
      :text="message"
      title="Confirm Change Working Location"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="onCancel">
          Cancel
        </v-btn>
        <v-btn @click="onConfirm">
          Accept
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { type ApiSong, type ApiState, execute_device_action } from '@/api/index.js'
import { computed, ref } from 'vue'
import { useHomeStore, useRoomStore } from '@/stores'
type Locaction = {
  id : string,
  name : string,
}
const dialog = ref(false)
const homeStore = useHomeStore()

const emit = defineEmits(['working-location-changed']);
const roomNames = homeStore.rooms.map((r) => r.name)
const props = defineProps<{
  device_id : string,
  state : ApiState
}>()

const currentLocation = computed(() => props.state.result.location as Locaction | null);
const selectedLocation = ref(currentLocation.value?.name ?? null)
const message = computed(() => 'Vacuum working location will be set to: ' + selectedLocation.value)

const onCancel = async () => {
  selectedLocation.value = currentLocation.value?.name ?? null;
  dialog.value = false;
}

const onConfirm = async () =>{
  await execute_device_action(props.device_id, 'setLocation', [homeStore.rooms.find((r) => r.name === selectedLocation.value)?.name!!])
  emit('working-location-changed');
  dialog.value = false
}


const handleChange = async (selected : string | null) => {
  if (!selected) return
  selectedLocation.value = selected
  dialog.value=true;
}

</script>