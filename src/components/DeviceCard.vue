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
  <div class="container">
  <v-card class="pa-3" min-height="10vh" :color="isActive ? 'focus' : ''" @click="$emit('click', id)">
    <v-card-item :prepend-icon="stateIcon">
      <template v-slot:title>
        {{ deviceName }}
      </template>
      <template v-slot:subtitle>
        <p class="capitalize">
          {{ state }}
        </p>
      </template>
    </v-card-item>
  </v-card>
  </div>
</template>

<style scoped>
.capitalize::first-letter {
  text-transform: capitalize;
}

.container{
  margin-right: 0.5rem;
}
</style>
