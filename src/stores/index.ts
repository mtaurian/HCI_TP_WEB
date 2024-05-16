import { ref, type Ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
// import {
//   get_homes,
//   get_rooms,
//   get_devices,
//   get_home_rooms,
//   get_room_devices,
//   get_home
// } from '@/api'

type DeviceType =
  | 'lampara'
  | 'aire'
  | 'aspiradora'
  | 'heladera'
  | 'parlante'
  | 'grifo'
  | 'aspersor'
  | 'persiana'
  | 'cortina'
  | 'toldo'
  | 'horno'
  | 'puerta'
  | 'alarma'
  | 'parlante'

export const useAllHousesStore = defineStore('houses_data', () => {
  const homes: Ref<{ name: string; code: string }[]> = ref([])

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function setHouses() {
    loading.value = true
    error.value = null

    try {
      // homes.value = (await get_homes()) as { name: string; code: string }[]

      homes.value = [
        {
          name: 'Casa Diego',
          code: 'abc123'
        },
        {
          name: 'Casa Juan',
          code: 'def456'
        },
        {
          name: 'Casa Pedro',
          code: 'ghi789'
        }
      ]
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false
  }

  return {
    homes,
    loading,
    error,
    setHouses
  }
})

export const useHomeStore = defineStore('home_data', () => {
  const home: Ref<{ name: string; code: string } | null> = ref(null)
  const rooms: Ref<{ name: string; code: string }[]> = ref([])
  const devices: Ref<{ name: string; code: string; type: DeviceType }[]> = ref([])

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function setCurrentHome(id: string) {
    loading.value = true
    error.value = null

    try {
      // home.value = (await get_home(id)) as { name: string; code: string }
      // home_rooms.value = (await get_home_rooms(home.value?.code)) as {
      //   name: string
      //   code: string
      // }[]

      // home_devices.value = []
      // for (const room of home_rooms.value) {
      //   try {
      //     home_devices.value.push(
      //       ...((await get_room_devices(room.code)) as {
      //         name: string
      //         code: string
      //         type: DeviceType
      //       }[])
      //     )
      //   } catch (e) {
      //     error.value = (e as { message: string }).message
      //     home_devices.value = []
      //     break
      //   }
      // }

      home.value = {
        name: 'Casa Diego',
        code: 'abc123'
      }

      rooms.value = [
        {
          name: 'Sala',
          code: 'abc123'
        },
        {
          name: 'Cocina',
          code: 'def456'
        },
        {
          name: 'Baño',
          code: 'ghi789'
        }
      ]

      devices.value = [
        {
          name: 'Persiana',
          code: 'abc123',
          type: 'persiana'
        },
        {
          name: 'Ventilador',
          code: 'def456',
          type: 'aire'
        },
        {
          name: 'Horno 7000',
          code: 'ghi789',
          type: 'horno'
        }
      ] as { name: string; code: string; type: DeviceType }[]
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false
  }

  return {
    home,
    rooms,
    devices,
    loading,
    error,
    setCurrentHome
  }
})

export const useRoomStore = defineStore('room_data', () => {
  const room: Ref<{ name: string; code: string } | null> = ref(null)
  const devices: Ref<{ name: string; code: string; type: DeviceType }[]> = ref([])

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function setCurrentRoom(id: string) {
    loading.value = true
    error.value = null

    try {
      // room.value = (await get_room(id)) as { name: string; code: string }
      // room_devices.value = (await get_room_devices(room.value?.code)) as {
      //   name: string
      //   code: string
      //   type: DeviceType
      // }[]

      room.value = {
        name: 'Casa Diego',
        code: 'abc123'
      }

      devices.value = [
        {
          name: 'Persiana',
          code: 'abc123',
          type: 'persiana'
        },
        {
          name: 'Ventilador',
          code: 'def456',
          type: 'aire'
        },
        {
          name: 'Horno 7000',
          code: 'ghi789',
          type: 'horno'
        }
      ] as { name: string; code: string; type: DeviceType }[]
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false
  }

  return {
    room,
    devices,
    loading,
    error,
    setCurrentRoom
  }
})

export const useDeviceStore = defineStore('device_data', () => {
  const device: Ref<{ name: string; code: string; type: DeviceType } | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function setCurrentDevice(id: string) {
    loading.value = true
    error.value = null

    try {
      // device.value = (await get_device(id)) as { name: string; code: string }

      device.value = {
        name: 'Persiana',
        code: 'abc123',
        type: 'persiana'
      }
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false
  }

  return {
    device,
    loading,
    error,
    setCurrentDevice
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAllHousesStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot))
}
