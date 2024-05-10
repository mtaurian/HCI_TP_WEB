<script setup lang="ts">
const props = defineProps<{
  deviceName: string
  state: string
  stateIcon: string
  isActive: boolean
  id : string
}>()
defineEmits<{

  click: [string]

}>()

</script>

<template>
  <v-card :color="isActive ? '#ff20e2' : ''" @click="$emit('click', id )" >
    <v-card-item>
      <template v-slot:title>
        {{ deviceName }}
      </template>
      <template v-slot:subtitle>
        {{ state }}
      </template>
      <v-icon role="img">
        {{ stateIcon }}
      </v-icon>
    </v-card-item>
  </v-card>
</template>


<style></style>
