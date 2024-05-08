<script setup lang="ts">
/**
 * Vue's Reactivity TL;DR:
 *
 * - ref: When my value is updated, notify everyone that is using me
 *    - To update my value, use .value, otherwise you will overwrite the reactivity
 * - computed: When my dependencies are updated, update my value
 * - watchEffect: When my dependencies are updated, execute my lambda function (callback)
 * - Built on anger against React and Angular
 *
 * Svelte's Reactivity TL;DR (Rant):
 * - All non const variables are reactive
 *    - Lol, just assign me a new value whenever you want, I will handle the reactivity
 * - Adding a $: at the begining makes the line reactive, including assignments (computed variables)
 * - No magic words required
 * - Built on (_vibes_)[https://github.com/sveltejs/svelte/discussions/10085]
 */

import { ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Imagine this is are API types
type Home = { name: string; code: string }
type Room = { name: string; code: string }

/**
 * This is a reactive variable to indicate if the data is being loaded
 */
const loading = ref(false)
/**
 * This is a reactive variable to store the response from the API
 */
const data: Ref<{ homes: Home[]; rooms: Room[] } | null> = ref(null)

// This must be only used in the select to set the initial values
// If you want to get the current value, use route.params.home and route.params.room respectively
/**
 * Don't use me, use route.params.home instead
 */
const initial_home: Ref<string | null> = ref(null)
/**
 * Don't use me, use route.params.room instead
 */
const initial_room: Ref<string | null> = ref(null)

watch([() => route.params.home, () => route.params.room], async () => {
  const { home, room } = (route.params as Record<'home' | 'room', string>) ?? {}

  // https://router.vuejs.org/guide/advanced/data-fetching

  loading.value = true

  // Imagine this is are API data
  const homes_data: Home[] = [
    {
      name: 'Casa Diego',
      code: 'abc123'
    },
    {
      name: 'Casa Maggie',
      code: 'def456'
    },
    {
      name: 'Casa Tomi',
      code: 'ghi789'
    }
  ]

  const rooms_data: Record<Home['code'], Room[]> = {
    abc123: [
      {
        name: 'Playroom',
        code: 'abc123-1'
      },
      {
        name: 'Living',
        code: 'abc123-2'
      },
      {
        name: 'Cocina',
        code: 'abc123-3'
      }
    ],
    def456: [
      {
        name: 'Cuarto Principal',
        code: 'def456-1'
      },
      {
        name: 'Cuarto de Invitados',
        code: 'def456-2'
      }
    ],
    ghi789: []
  }

  data.value = { homes: homes_data, rooms: [] }

  loading.value = false

  // If home or room are not within the available options, redirect to NotFound
  if (
    (home && !homes_data.find((e) => e.code === home)) ||
    (room && !rooms_data[home]?.find((e) => e.code === room))
  ) {
    await router.push({ name: 'NotFound' })
    return
  }

  data.value.rooms = rooms_data[home] ?? []

  initial_home.value = home || data.value.homes[0]?.code
  initial_room.value = room || data.value.rooms[0]?.code
})

function changeHome(home: string | null) {
  router.push({ name: 'dashboard', params: { home } })
}

function changeRoom(room: string | null) {
  router.push({ name: 'dashboard', params: { home: route.params.home, room } })
}
</script>

<template>
  <v-app-bar app class="bg-background" flat>
    <v-toolbar-title>
      <div class="flex">
        <img src="@/assets/logo.png" alt="logo" class="logo" />
        <div class="select">
          <v-select
            label="Casa"
            v-model="initial_home"
            :items="data?.homes"
            item-title="name"
            item-value="code"
            :loading
            @update:modelValue="changeHome"
            variant="solo-filled"
            density="compact"
          >
            <template #no-data></template>
            <template #append-item>
              <v-list-item prepend-icon="mdi-plus" link>
                <v-list-item-title>Crear Casa</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
          <v-select
            label="Cuarto"
            v-model="initial_room"
            :items="data?.rooms"
            item-title="name"
            item-value="code"
            :loading
            @update:modelValue="changeRoom"
            variant="solo-filled"
            density="compact"
          >
            <template #no-data>
              <v-list-item v-if="!route.params.home" disabled>
                <v-list-item-title>Seleccioná una casa primero</v-list-item-title>
              </v-list-item>
            </template>
            <template #append-item v-if="route.params.home">
              <v-list-item prepend-icon="mdi-plus" link>
                <v-list-item-title>Crear Cuarto</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </div>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<style>
.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 4rem;
  margin-bottom: 16px;
}

.select {
  display: flex;
  margin-top: 2rem;
  gap: 1rem;
  width: 100%;
  height: 80px;
}

.select > * {
  width: 40%;
}
</style>
