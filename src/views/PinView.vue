<script setup lang="ts">
import { usePinStore } from '@/stores'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const pin = usePinStore()

const dialog = ref(true)
watch(dialog, async () => {
  await router.replace({
    path: route.fullPath.slice(4)
  })
})

const valid = ref(true)

function validate(n: string) {
  valid.value = pin.validate(n)
  if (valid.value) {
    dialog.value = false
  }
}

function on_change(n: string) {
  if (n.length !== 4) {
    // Oh, the irony
    valid.value = true
  }
}
</script>

<template>
  <v-dialog v-model="dialog" persistent width="600">
    <v-card
      max-width="600"
      prepend-icon="mdi-lock"
      title="This house is pin protected"
      text="To gain full control, please insert the secret pin. You may continue without it, but some features will be blocked."
    >
      <v-otp-input
        :length="4"
        :error="!valid"
        variant="underlined"
        @finish="validate"
        @update:model-value="on_change"
      />
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Skip for now" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
