import { ref, type Ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import {
  get_homes,
  get_home_rooms,
  get_room_devices,
  get_home,
  get_room,
  get_device,
  get_routines,
  get_routine,
  listen_all_events,
  listen_device_events,
  get_devices,
  type ApiError,
  type ApiReturns
} from '@/api'

export function handleApiError(err: unknown, ref: Ref<string | null>) {
  if (err instanceof Error) {
    console.error(err)
    ref.value = err.message
  } else {
    const { error } = err as ApiError

    console.error(err)

    if (typeof error.description === 'string') ref.value = error.description
    else ref.value = error.description.join(', ').toUpperCase()
  }
}

export const useAllHousesStore = defineStore('houses_data', () => {
  const homes: Ref<Awaited<ReturnType<typeof get_homes>>['result']> = ref([])

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function setHouses() {
    loading.value = true
    error.value = null

    try {
      homes.value = (await get_homes()).result
    } catch (e) {
      handleApiError(e, error)
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
  const home: Ref<Awaited<ReturnType<typeof get_home>>['result'] | null> = ref(null)
  const rooms: Ref<Awaited<ReturnType<typeof get_home_rooms>>['result']> = ref([])
  const devices: Ref<Awaited<ReturnType<typeof get_devices>>['result']> = ref([])
  const routines: Ref<Awaited<ReturnType<typeof get_routines>>['result']> = ref([])

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  async function setCurrentHome(id: string) {
    loading.value = true
    error.value = null

    try {
      home.value = (await get_home(id)).result
      rooms.value = (await get_home_rooms(home.value?.id)).result
      routines.value = (await get_routines()).result.filter(
        (r) => 'house_id' in r.meta && home.value?.id === r.meta.house_id
      )

      devices.value = (await get_devices()).result.filter(
        (d) => d.room?.home?.id === home.value?.id
      )
    } catch (e) {
      handleApiError(e, error)
    }

    loading.value = false
  }

  function invalidate() {
    return setCurrentHome(home.value!.id)
  }

  return {
    home,
    rooms,
    devices,
    routines,
    loading,
    error,
    setCurrentHome,
    invalidate
  }
})

export const useRoomStore = defineStore('room_data', () => {
  const room: Ref<Awaited<ReturnType<typeof get_room>>['result'] | null> = ref(null)
  const devices: Ref<Awaited<ReturnType<typeof get_room_devices>>['result']> = ref([])

  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  let events: ReturnType<typeof listen_all_events> | null = null

  async function setCurrentRoom(id: string) {
    loading.value = true
    error.value = null

    try {
      room.value = (await get_room(id)).result
      devices.value = (await get_room_devices(room.value?.id)).result
    } catch (e) {
      handleApiError(e, error)
    }

    if (events) events.close()
    if (devices.value) {
      events = listen_all_events((e) => {
        const { event, args, deviceId } = e as {
          event: string
          args: Record<string, ApiReturns>
          deviceId: string
        }

        if (event === 'statusChanged') {
          const i = devices.value.findIndex((d) => d.id === deviceId)
          if (i >= 0) {
            console.log('statusChanged', args.newStatus)
            devices.value[i].state.status = args.newStatus
          }
        }
      })
    } else events = null

    loading.value = false
  }

  function invalidate() {
    return setCurrentRoom(room.value!.id)
  }

  return {
    room,
    devices,
    loading,
    error,
    setCurrentRoom,
    invalidate
  }
})

export const useDeviceStore = defineStore('device_data', () => {
  const device: Ref<Awaited<ReturnType<typeof get_device>>['result'] | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  let events: ReturnType<typeof listen_all_events> | null = null

  async function setCurrentDevice(id: string) {
    loading.value = true
    error.value = null

    try {
      device.value = (await get_device(id)).result
    } catch (e) {
      handleApiError(e, error)
    }

    if (events) events.close()
    if (device.value) {
      events = listen_device_events(id, (e) => {
        const { event, args } = e as {
          event: string
          args: Record<string, ApiReturns>
        }

        if (event === 'statusChanged') {
          // If device is null, the event listener is closed/not created
          device.value!.state.status = args.newStatus
        }
      })
    } else events = null

    loading.value = false
  }

  function invalidate() {
    return setCurrentDevice(device.value!.id)
  }

  return {
    device,
    loading,
    error,
    setCurrentDevice,
    invalidate
  }
})

export const useRoutineStore = defineStore('routine_data', () => {
  const routine: Ref<Awaited<ReturnType<typeof get_routine>>['result'] | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  function invalidate() {
    return setCurrentRoutine(routine.value!.id)
  }

  async function setCurrentRoutine(id: string) {
    loading.value = true
    error.value = null

    try {
      routine.value = (await get_routine(id)).result
    } catch (e) {
      handleApiError(e, error)
    }
    console.log(routine.value)
    loading.value = false
  }

  return {
    routine,
    loading,
    error,
    setCurrentRoutine,
    invalidate
  }
})

export const usePinStore = defineStore('pin_store', () => {
  const pin: Ref<string | null> = ref(null)
  const homeId: Ref<string | null> = ref(null)

  function set(id: string, value: string | null) {
    homeId.value = id
    pin.value = value
  }

  function validate(value: string) {
    if (!pin.value) return true
    if (pin.value !== value) return false

    pin.value = null
    return true
  }

  return {
    homeId,
    pin,
    set,
    validate
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAllHousesStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useHomeStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useRoomStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useDeviceStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useRoutineStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(usePinStore, import.meta.hot))
}
