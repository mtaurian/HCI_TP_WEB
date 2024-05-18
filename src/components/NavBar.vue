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

import { computed, ref, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAllHousesStore, useHomeStore, useRoomStore } from '@/stores'

const router = useRouter()
const route = useRoute()

const housesStore = useAllHousesStore()
const homeStore = useHomeStore()
const roomStore = useRoomStore()

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

const loading = computed(() => housesStore.loading || homeStore.loading || roomStore.loading)

watch(
  [() => route.params.home, () => route.params.room],
  async () => {
    if (!['load-dashboard', 'dashboard'].includes(route.name as string)) return

    const { home, room } = (route.params ?? {}) as Record<'home' | 'room', string | undefined>

    // https://router.vuejs.org/guide/advanced/data-fetching
    await housesStore.setHouses()

    if (housesStore.error) {
      console.error('Error fetching data', housesStore.error)

      // TODO: 500 page
      await router.replace({
        name: 'NotFound',
        // preserve current path and remove the first char to avoid the target URL starting with `//`
        params: { pathMatch: route.path.substring(1).split('/') },
        // preserve existing query and hash if any
        query: route.query,
        hash: route.hash
      })

      return
    }

    // If there are no homes available, redirect to NotFound (TODO: Add first house flow)
    if (!housesStore.homes?.length) {
      console.error('No homes available')

      await router.replace({
        name: 'NotFound',
        // preserve current path and remove the first char to avoid the target URL starting with `//`
        params: { pathMatch: route.path.substring(1).split('/') },
        // preserve existing query and hash if any
        query: route.query,
        hash: route.hash
      })

      return
    }

    // Redirect to the first available home if none is provided
    if (!home) {
      await router.replace({
        name: 'dashboard',
        params: {
          home: housesStore.homes[0]?.id
        }
      })

      return
    }

    await homeStore.setCurrentHome(home)

    if (homeStore.error) {
      console.error('Error fetching home data', homeStore.error)

      await router.replace({
        name: 'NotFound',
        // preserve current path and remove the first char to avoid the target URL starting with `//`
        params: { pathMatch: route.path.substring(1).split('/') },
        // preserve existing query and hash if any
        query: route.query,
        hash: route.hash
      })

      return
    }

    // Redirect to the first available room if possible (maybe the house has no rooms)
    if (!room && homeStore.rooms?.length) {
      await router.replace({
        name: 'dashboard',
        params: {
          home,
          room: homeStore.rooms[0].id
        }
      })

      return
    }

    if (room) {
      await roomStore.setCurrentRoom(room)

      if (roomStore.error) {
        console.error('Error fetching room data', roomStore.error)

        await router.replace({
          name: 'NotFound',
          // preserve current path and remove the first char to avoid the target URL starting with `//`
          params: { pathMatch: route.path.substring(1).split('/') },
          // preserve existing query and hash if any
          query: route.query,
          hash: route.hash
        })

        return
      }
    }

    initial_home.value = home
    initial_room.value = room ?? null
  },
  { immediate: true }
)

function changeHome(home: string) {
  router.push({ name: 'dashboard', params: { home } })
}

function changeRoom(room: string) {
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
            :items="housesStore.homes"
            item-title="name"
            item-value="id"
            :loading
            :disabled="loading"
            @update:modelValue="changeHome"
            variant="solo-filled"
            density="compact"
          >
            <template #no-data></template>
            <template #append-item>
              <v-list-item prepend-icon="mdi-plus" link variant="tonal">
                <v-list-item-title>Crear Casa</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
          <v-select
            label="Cuarto"
            v-model="initial_room"
            :items="homeStore.rooms"
            item-title="name"
            item-value="id"
            :loading
            :disabled="loading"
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
              <v-list-item prepend-icon="mdi-plus" link variant="tonal">
                <v-list-item-title>Crear Cuarto</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </div>
      </div>
    </v-toolbar-title>
    <template #append>
      <h1>Hi</h1>
    </template>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<style scoped>
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
