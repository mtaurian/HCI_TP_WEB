<script setup lang="ts">
const props = defineProps<{
  deviceName: string
  state: string
  stateIcon: string
  isActive: boolean
  id: string
}>()

defineEmits<{
  click: [string]
}>()
</script>

<template>
  <v-card :color="isActive ? 'focus' : ''" @click="$emit('click', id)">
    <v-card-item>
      <template v-slot:title>
        {{ deviceName }}
      </template>
      <template v-slot:subtitle>
        <p class="capitalize">
          {{ state }}
        </p>
      </template>
      <v-icon role="img">
        {{ stateIcon }}
      </v-icon>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.capitalize::first-letter {
  text-transform: capitalize;
}
</style>
