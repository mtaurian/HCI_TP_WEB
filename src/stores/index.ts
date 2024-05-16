import { computed, ref, type Ref } from 'vue'
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

export const useApiDataStore = defineStore('api_data', () => {
  const data: Ref<{
    homes: { name: string; code: string }[]
    rooms: { name: string; code: string }[]
    devices: { name: string; code: string; type: DeviceType }[]
  } | null> = ref(null)

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function updateData() {
    loading.value = true
    error.value = null

    try {
      // data.value = {
      //   homes: (await get_homes()) as { name: string; code: string }[],
      //   rooms: (await get_rooms()) as { name: string; code: string }[],
      //   devices: (await get_devices()) as { name: string; code: string; type: DeviceType }[]
      // }

      data.value = {
        homes: [
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
        ],
        rooms: [
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
        ],
        devices: [
          {
            name: 'Persiana',
            code: 'abc123',
            type: 'persiana'
          },
          {
            name: 'AC',
            code: 'def456',
            type: 'aire'
          },
          {
            name: 'Horno 7000',
            code: 'ghi789',
            type: 'horno'
          }
        ]
      }
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false

    return data.value
  }

  return {
    data,
    loading,
    error,
    updateData
  }
})

export const useHouseStore = defineStore('house_data', () => {
  const home: Ref<{ name: string; code: string } | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  const home_rooms: Ref<Promise<{ name: string; code: string }[]>> = computed(async () => {
    if (!home.value) return []

    try {
      // return await get_home_rooms(home.value?.code)
      return [
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
    } catch (e) {
      error.value = (e as { message: string }).message
      return []
    }
  })

  const home_devices: Ref<Promise<{ name: string; code: string; type: DeviceType }[]>> = computed(
    async () => {
      if (!home.value) return []

      // const devices: any[] = []
      // const rooms = await home_rooms.value

      // for (const room of rooms) {
      //   try {
      //     const room_devices = await get_room_devices(room.code)
      //     devices.push(...(room_devices as any[]))
      //   } catch (e) {
      //     error.value = (e as { message: string }).message
      //     return []
      //   }
      // }

      // return devices

      return [
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
    }
  )

  async function setCurrentHome(id: string) {
    console.log('setCurrentHome', id)

    loading.value = true
    error.value = null

    try {
      // home.value = (await get_home(id)) as { name: string; code: string }

      home.value = {
        name: 'Casa Diego',
        code: 'abc123'
      }
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false

    return home.value
  }

  return {
    home,
    home_rooms,
    home_devices,
    loading,
    error,
    setCurrentHome
  }
})

export const useRoomStore = defineStore('room_data', () => {
  const room: Ref<{ name: string; code: string } | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  const room_devices: Ref<Promise<{ name: string; code: string; type: DeviceType }[]>> = computed(
    async () => {
      if (!room.value) return []

      try {
        // return await get_room_devices(room.value?.code)
        return [
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
        return []
      }
    }
  )

  async function setCurrentRoom(id: string) {
    console.log('setCurrentRoom', id)

    loading.value = true
    error.value = null

    try {
      // room.value = (await get_home(id)) as { name: string; code: string }

      room.value = {
        name: 'Casa Diego',
        code: 'abc123'
      }
    } catch (e) {
      console.error(e)
      error.value = (e as { message: string }).message
    }

    loading.value = false

    return room.value
  }

  return {
    room,
    room_devices,
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
    console.log('setCurrentDevice', id)

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

    return device.value
  }

  return {
    device,
    loading,
    error,
    setCurrentDevice
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useApiDataStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useHouseStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot))
}
