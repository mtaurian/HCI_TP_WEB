<template>
  <div class="home-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="isDock ? 'green-lighten-2' : 'white-lighten-2'"
      :size="50"
      variant="text"
      :disabled="isDock"
    >
      <v-icon icon="mdi-home" :size="50" />
    </v-btn>
    <v-label>{{isDock ? 'Already in base' : 'Go back to dock base'}}</v-label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type ApiSong, type ApiState, execute_device_action } from '@/api'

const props = defineProps<{
  state : ApiState,
  device_id: string
}>()


const isDock = computed(()=>{
  return props.state.result.status === 'docked'
})

const emit = defineEmits(['dock-changed']);

/**
 * If device isDock, do nothing
 * If device is not Dock, dock it
 */
const handleOnClick = async () => {
  if (!isDock.value){
    await execute_device_action(props.device_id,'dock', []);
    emit('dock-changed');
  }
}

</script>

<style scoped>

.home-button{
  display : flex;
  flex-direction: column;
  align-items: center;
}

</style>

