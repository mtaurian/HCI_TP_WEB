<script setup lang="ts">
import { execute_routine, type Routine } from '@/api'
import router from '@/router'

const props = defineProps<{
  routine: Routine
  isSelected: boolean
}>()

defineEmits<{
  click: [string]
}>()

const handleExecute = async () => {

  try {

    await execute_routine(props.routine.id);
  } catch (error){
    alert("something went wrong" )
    console.log(error)
  }
}

</script>

<template>
  <div class="container">
  <v-card class="pa-2" min-height="10vh" :color="isSelected ? 'focus' : ''" @click="$emit('click', routine.id)">
    <v-card-item >
      <template v-slot:title>
        <div class="flex">
            {{props.routine.name}}
          <v-btn icon="mdi-play" variant="tonal"
                 @click="handleExecute"
          />
        </div>
      </template>
      <template v-slot:subtitle>
        <p class="capitalize">
          {{ props.routine.actions.length > 1 ? props.routine.actions.length + ' Registered actions' : '1 Registered action'  }}        </p>
      </template>
    </v-card-item>
  </v-card>
  </div>
</template>

<style scoped>
.capitalize::first-letter {
  text-transform: capitalize;
}
.flex{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}
.container{
  margin-right: 0.5rem;
}
</style>
