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
import {
  useAllHousesStore,
  useHomeStore,
  useRoomStore,
  useDeviceStore,
  useRoutineStore
} from '@/stores'
import AddHome from './AddHome.vue'
import AddRoom from './AddRoom.vue'

const router = useRouter()
const route = useRoute()

const housesStore = useAllHousesStore()
const homeStore = useHomeStore()
const roomStore = useRoomStore()
const deviceStore = useDeviceStore()
const routineStore = useRoutineStore()

const newHomeDialog = ref(false)
const newRoomDialog = ref(false)

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
function openNewHome() {
  newHomeDialog.value = true
}
function openNewRoom() {
  newRoomDialog.value = true
}
function closeNewHome() {
  newHomeDialog.value = false
}

function closeNewRoom() {
  newRoomDialog.value = false
}

watch(
  [() => route.params.home, () => route.params.room],
  async () => {
    if (['load-dashboard', 'dashboard'].includes(route.name as string)) {
      homeStore.home = null
      roomStore.room = null
      deviceStore.device = null

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
          name: 'routines' === route.name ? 'routines' : 'dashboard',
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

      initial_home.value = home

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
      } else {
        roomStore.room = null
      }

      initial_room.value = room ?? null
    } else if (route.name === 'routines') {
      routineStore.routine = null

      const { home } = (route.params ?? {}) as { home: string | undefined }

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
          name: 'routines' === route.name ? 'routines' : 'dashboard',
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

      await routineStore.setCurrentRoutine(homeStore.routines[0].id)

      if (routineStore.error) {
        console.error('Error fetching routine data', routineStore.error)

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

      initial_home.value = home
    }
  },
  { immediate: true }
)

function changeHome(home: string) {
  console.log(home)
  router.push({ name: route.name!, params: { home } })
}

function changeRoom(room: string) {
  router.push({ name: 'dashboard', params: { home: route.params.home, room } })
}

function goToRoutinesEditor() {
  const home = route.params.home
  router.push({ name: 'routines', params: { home } })
}

function goToDevices() {
  const home = route.params.home
  router.push({ name: 'dashboard', params: { home } })
}
</script>

<template>
  <AddHome @turnoff="closeNewHome"  v-if="newHomeDialog" />
  <AddRoom
    @turnoff="closeNewRoom"
    :code="
      homeStore.home?.meta && typeof homeStore.home?.meta.houseCode === 'string'
        ? homeStore.home?.meta.houseCode
        : null
    "
    v-if="newRoomDialog"
  />

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
              <v-list-item prepend-icon="mdi-plus" link variant="tonal" @click="openNewHome">
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
            v-if="!route.fullPath.includes('routines')"
          >
            <template v-slot:prepend-inner>
              <v-icon>{{ roomStore.room?.meta.roomIcon }}</v-icon>
            </template>
            <template #no-data>
              <v-list-item v-if="!route.params.home" disabled>
                <v-list-item-title>Seleccioná una casa primero</v-list-item-title>
              </v-list-item>
            </template>
            <template #append-item>
              <v-list-item prepend-icon="mdi-plus" link variant="tonal" @click="openNewRoom">
                <v-list-item-title>Crear Cuarto</v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </div>
      </div>
    </v-toolbar-title>
    <template #append>
      <v-btn
        class="routine-device-button"
        v-if="route.fullPath.includes('routines')"
        prepend-icon="mdi-devices"
        variant="tonal"
        @click="goToDevices"
      >
        Go to Devices
      </v-btn>
      <v-btn
        v-else
        class="routine-device-button"
        prepend-icon="mdi-clipboard-list"
        variant="tonal"
        @click="goToRoutinesEditor"
      >
        Go to Routines
      </v-btn>
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

.routine-device-button {
  margin-right: 2rem;
}
</style>
