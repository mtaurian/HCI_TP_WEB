<template>
   <div>
     <span class="span">Battery Level</span>
     <div class="flex">
       <v-progress-linear height="20rem"
                           max="100"
                           min="0"
                           :active="true"
                           :color="bt_lvl < 5 ? 'red' : (bt_lvl < 40 ? 'orange' : 'green')"
                           :model-value="bt_lvl"
                           class="progress"
                           striped
                           rounded="lg"
                           bg-color="blue"
        />
        <span>{{bt_lvl}}%</span>
     </div>
   </div>
</template>

<script setup lang="ts">
import { type ApiSong, type ApiState } from '@/api/index.js'
import { computed } from 'vue'

const props = defineProps<{
  device_id: string
  state : ApiState
}>()

const bt_lvl = computed(() => {
  return Number(props.state.result.batteryLevel ?? 0);
});


</script>

<style scoped>
.progress{
  width: 20rem;
  margin-right: 10px;
}
.flex{
  display: flex;
  flex-direction: row;
}
.span{
  margin-bottom: 20px;
}
</style>