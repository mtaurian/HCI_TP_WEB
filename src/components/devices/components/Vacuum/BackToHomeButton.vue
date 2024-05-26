<template>
  <div class="home-button">
    <v-btn
      @click="handleOnClick"
      class="ma-2"
      :color="isDock ? 'green-lighten-2' : 'white-lighten-2'"
      height="80"
      width="200"
      variant="text"
    ><div class="iconPos">
      <v-icon class="mb-2" icon="mdi-home" :size="50" />
      {{isDock ? 'Charging' : 'Go back to dock base'}}
    </div>
    </v-btn>
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
  }else{
    await execute_device_action(props.device_id,'pause', []);
    emit('dock-changed');
  }
}

</script>

<style scoped>

.home-button{
  display : flex;
  margin-right: 1rem;
  flex-direction: column;
  margin-left: 0.5rem;
  align-items: center;
}
.iconPos{
   display: flex;
   flex-direction: column;
   justify-content: center; /* Centra los elementos horizontalmente */
   align-items: center; /* Centra los elementos verticalmente */
   align-content: center;
 }

</style>

