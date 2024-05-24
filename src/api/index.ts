const BASE_URL = 'http://localhost:8080/api'

//#region Types

export type ApiResponse<T> = Promise<{ result: T }>

export type ApiError = {
  error: {
    code: number
    description: string | string[]
  }
}

export type ApiSong = {
  song: string
  artist: string
  album: string
  duration: string
}

export type Location = {
  id : string,
  name : string
}

export type ApiParams = string | number
export type ApiReturns = string | number | boolean | ApiSong[] | Location |  null
export type ApiEvent = Record<string, string | number | ApiSong>
export type ApiState = {result : Record<string, ApiReturns>}

interface ApiVariable<Example, Type extends string> {
  type: Type
  description: string
  example: Example
}

interface ApiArgument extends ApiVariable<ApiParams, 'string' | 'number'> {
  name: string
  minValue?: ApiParams
  maxValue?: ApiParams
  supportedValues?: ApiParams[]
}

export type ApiMeta = Record<string, unknown>

interface ApiEntry {
  id: string
  name: string
  meta: ApiMeta
}

interface ApiDeviceEntry {
  timestamp: string
  deviceId: string
}

export interface Home extends ApiEntry {}

export interface Room extends ApiEntry {
  home?: Omit<Home, 'meta'>
}

export interface DeviceType {
  id: string
  name: string
  powerUsage: number
  actions: {
    name: string
    params: ApiArgument[]
    return: ApiVariable<ApiReturns, 'string' | 'number' | 'boolean' | 'object'>
  }[]
  events: {
    name: string
    args: ApiVariable<ApiEvent, 'object'>
  }[]
}

export interface Device extends ApiEntry {
  type: Pick<DeviceType, 'id' | 'name' | 'powerUsage'>
  state: Record<string, ApiReturns>
  room?: Omit<Room, 'meta'>
}

export interface DeviceLog extends ApiDeviceEntry {
  action: string
  params: ApiParams[]
  result: ApiParams
}

export interface DeviceEvent extends ApiDeviceEntry {
  event: string
  args: Record<string, ApiParams>
}

export interface ApiAction {
  device: Device
  actionName: string
  params: ApiParams[]
  meta: ApiMeta
}

export interface Routine extends ApiEntry {
  actions: ApiAction[]
}

//#endregion

//#region All devices

/**
 * Retrieve all devices
 *
 * @returns An array of all devices
 */
export async function get_devices(): ApiResponse<Device[]> {
  const res = await fetch(`${BASE_URL}/devices`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve all device of a specific type
 *
 * @param type The device type id to filter by
 * @returns An array of devices of the specified type
 */
export async function get_devices_by_type(type: string): ApiResponse<Omit<Device, 'type'>[]> {
  const res = await fetch(`${BASE_URL}/devices/devicetype/${type}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve logs for all devices
 *
 * @param limit The number of logs to retrieve
 * @param offset The offset to VacuumPowerButton.vue retrieving logs from
 * @returns An array of logs (The logs are NOT(!) sorted by timestamp)
 */
export async function retrieve_all_logs(limit: number, offset: number): ApiResponse<DeviceLog[]> {
  const res = await fetch(`${BASE_URL}/devices/logs/${limit}/offset/${offset}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Subscribe to all devices' state changes
 *
 * @example
 * ```ts
 * const source = listen_all_events((e) => {
 *   console.log(e)
 * })
 *
 * // Later, when you want to stop listening
 * source.close()
 * ```
 *
 * @param callback The callback to execute when the state changes
 * @returns The event source
 */
export function listen_all_events(callback: (e: DeviceEvent) => void): EventSource {
  const source = new EventSource(`${BASE_URL}/devices/events`)
  source.onmessage = ({ data }) => {
    const e = JSON.parse(data) as DeviceEvent
    callback(e)
  }

  return source
}

//#endregion

//#region Device

/**
 * Add a new device
 *
 * @param type_id The new device type
 * @param name The new device name
 * @param meta The new device metadata
 * @returns The new device data
 */
export async function add_device(
  type_id: string,
  name: string,
  meta: ApiMeta
): ApiResponse<Device> {
  const res = await fetch(`${BASE_URL}/devices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: {
        id: type_id
      },
      name,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve a device by id
 *
 * @param id The device id
 * @returns The device data
 */
export async function get_device(id: string): ApiResponse<Device> {
  const res = await fetch(`${BASE_URL}/devices/${id}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Update a device by id
 *
 * @param id The device id
 * @param name The new device name
 * @param meta The new device metadata
 * @returns Whether the update was successful
 */
export async function update_device(id: string, name: string, meta: ApiMeta): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/devices/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Delete a device by id
 *
 * @param id The device id
 * @returns Whether the deletion was successful
 */
export async function delete_device(id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/devices/${id}`, {
    method: 'DELETE'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve a single device's state
 *
 * @param id The device id
 * @returns The device state
 */
export async function get_device_state(id: string): ApiResponse<Device['state']> {
  const res = await fetch(`${BASE_URL}/devices/${id}/state`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Subscribe to a device's state changes
 *
 * @example
 * ```ts
 * const source = listen_device_events('device-id', (log) => {
 *   console.log(log)
 * })
 *
 * // Later, when you want to stop listening
 * source.close()
 * ```
 *
 * @param id The device id
 * @param callback The callback to execute when the state changes
 * @returns The event source
 */
export function listen_device_events(id: string, callback: (e: DeviceEvent) => void): EventSource {
  const source = new EventSource(`${BASE_URL}/devices/${id}/events`)
  source.onmessage = ({ data }) => {
    const e = JSON.parse(data) as DeviceEvent
    callback(e)
  }

  return source
}

/**
 * Retrieve a single device's logs
 *
 * @param id The device id
 * @param limit The number of logs to retrieve
 * @param offset The offset to VacuumPowerButton.vue retrieving logs from
 * @returns An array of logs (The logs are NOT(!) sorted by timestamp)
 */
export async function get_device_logs(
  id: string,
  limit: number,
  offset: number
): ApiResponse<DeviceLog[]> {
  const res = await fetch(`${BASE_URL}/devices/${id}/logs/limit/${limit}/offset/${offset}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Execute a device's actions by id and action name
 *
 * @param id The device id
 * @param action The action name to execute
 * @param params The action parameters
 * @returns The result of the action (Many times it's the previous state)
 */
export async function execute_device_action(
  id: string,
  action: string,
  params: ApiParams[]
): ApiResponse<ApiReturns> {
  const res = await fetch(`${BASE_URL}/devices/${id}/${action}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

//#endregion

//#region Device Type

/**
 * Retrieve all device types
 *
 * @note I strongly recommend NOT using this method in the code.
 * It's main purpose is for us to discover how the API works.
 *
 * @returns An array of all device types
 */
export async function get_device_types(): ApiResponse<DeviceType[]> {
  const res = await fetch(`${BASE_URL}/devicetypes`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve a device type by id
 *
 * @param id The device type id
 * @returns The device type data
 */
export async function get_device_type(id: string): ApiResponse<DeviceType> {
  const res = await fetch(`${BASE_URL}/devicetypes/${id}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

//#endregion

//#region Home

/**
 * Retrieve all homes
 *
 * @returns An array of all homes
 */
export async function get_homes(): ApiResponse<Home[]> {
  const res = await fetch(`${BASE_URL}/homes`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Add a new home
 *
 * @param name The new home name
 * @param meta The new home metadata
 * @returns The new home data
 */
export async function add_home(name: string, meta: ApiMeta): ApiResponse<Home> {
  const res = await fetch(`${BASE_URL}/homes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve a home by id
 *
 * @param id The home id
 * @returns The home data
 */
export async function get_home(id: string): ApiResponse<Home> {
  const res = await fetch(`${BASE_URL}/homes/${id}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Update a home by id
 *
 * @param id The home id
 * @param name The new home name
 * @param meta The new home metadata
 * @returns Whether the update was successful
 */
export async function update_home(id: string, name: string, meta: ApiMeta): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/homes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Delete a home by id
 *
 * @param id The home id
 * @returns Whether the deletion was successful
 */
export async function delete_home(id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/homes/${id}`, {
    method: 'DELETE'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

//#endregion

//#region Room

/**
 * Get all rooms
 *
 * @note NOT recommended to use in the code. At least not for our design.
 *
 * @returns An array of all rooms in the system
 */
export async function get_rooms(): ApiResponse<Room[]> {
  const res = await fetch(`${BASE_URL}/rooms`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Add a new room
 *
 * @param name The new room name
 * @param meta The new room metadata
 * @returns The new room data
 */
export async function add_room(name: string, meta: ApiMeta): ApiResponse<Room> {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve a room by id
 *
 * @param id The room id
 * @returns The room data
 */
export async function get_room(id: string): ApiResponse<Room> {
  const res = await fetch(`${BASE_URL}/rooms/${id}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Update a room by id
 *
 * @param id The room id
 * @param name The new room name
 * @param meta The new room metadata
 * @returns Whether the update was successful
 */
export async function update_room(id: string, name: string, meta: ApiMeta): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Delete a room by id
 *
 * @param id The room id
 * @returns Whether the deletion was successful
 */
export async function delete_room(id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/rooms/${id}`, {
    method: 'DELETE'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

//#endregion

//#region Home-Room Relationship

/**
 * Retrieve all rooms in a home
 *
 * @param home_id The home id
 * @returns An array of all rooms in the home
 */
export async function get_home_rooms(home_id: string): ApiResponse<Omit<Room, 'home'>[]> {
  const res = await fetch(`${BASE_URL}/homes/${home_id}/rooms`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Add an EXISTING room to a home
 *
 * @param home_id The home id
 * @param room_id The room id
 * @returns Whether the addition was successful
 */
export async function add_room_to_home(home_id: string, room_id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/homes/${home_id}/rooms/${room_id}`, {
    method: 'POST'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Remove a room from a home
 *
 * @param room_id The room id
 * @returns Whether the removal was successful
 */
export async function remove_room_from_home(room_id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/homes/rooms/${room_id}`, {
    method: 'DELETE'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

//#endregion

//#region Room-Device Relationship

/**
 * Retrieve all devices in a room
 *
 * @param room_id The room id
 * @returns
 */
export async function get_room_devices(room_id: string): ApiResponse<Omit<Device, 'room'>[]> {
  const res = await fetch(`${BASE_URL}/rooms/${room_id}/devices`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Add an EXISTING device to a room
 *
 * @param room_id The room id
 * @param device_id The device id
 * @returns Whether the addition was successful
 */
export async function add_device_to_room(room_id: string, device_id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/rooms/${room_id}/devices/${device_id}`, {
    method: 'POST'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Remove a device from a room
 *
 * @param device_id The device id
 * @returns Whether the removal was successful
 */
export async function remove_device_from_room(device_id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/rooms/devices/${device_id}`, {
    method: 'DELETE'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Change a device's room
 *
 * @note Not API native. This is a helper function.
 *
 * @param device_id The device id
 * @param room_id The new room id
 * @returns Whether the change was successful
 */
export async function change_device_room(device_id: string, room_id: string): ApiResponse<boolean> {
  const remove = await remove_device_from_room(device_id)

  if (!remove.result) {
    throw {
      error: {
        code: 500,
        description: 'Failed to remove device from room'
      }
    }
  }

  return add_device_to_room(room_id, device_id)
}

//#endregion

//#region Routine

/**
 * Retrieve all routines
 *
 * @returns An array of all routines
 */
export async function get_routines(): ApiResponse<Routine[]> {
  const res = await fetch(`${BASE_URL}/routines`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Add a new routine
 *
 * @example
 * ```ts
 * await add_routine('Change the mood', [
 *   {
 *     device: { id: 'device-id' },
 *     actionName: 'changeColor',
 *     params: ['FF00FF'],
 *     meta: {}
 *   }
 * ], {});
 * ```
 *
 * @note The API does NOT validate if the parameters are correct.
 * If missing or wrong, the routine will fail when executed.
 *
 * @param name The new routine name
 * @param actions The new routine actions
 * @param meta The new routine metadata
 * @returns The new routine data
 */
export async function add_routine(
  name: string,
  actions: (Omit<ApiAction, 'device'> & { device: Pick<Device, 'id'> })[], // Unfortunately, this nasty type is really needed
  meta: ApiMeta
): ApiResponse<Routine> {
  const res = await fetch(`${BASE_URL}/routines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      actions,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Retrieve a routine by id
 *
 * @param id The routine id
 * @returns The routine data
 */
export async function get_routine(id: string): ApiResponse<Routine> {
  const res = await fetch(`${BASE_URL}/routines/${id}`)
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Update a routine by id
 *
 * @example
 * ```ts
 * await update_routine('Change the mood (updated)', [
 *   {
 *     device: { id: 'device-id' },
 *     actionName: 'setColor',
 *     params: ['FFFF00'],
 *     meta: {}
 *   }
 * ], {});
 * ```
 *
 * @note The API does NOT validate if the parameters are correct.
 * If missing or wrong, the routine will fail when executed.
 *
 * @param id The routine id
 * @param name The new routine's name
 * @param actions The new routine's actions
 * @param meta The new routine's metadata
 * @returns Whether the update was successful
 */
export async function update_routine(
  id: string,
  name: string,
  actions: (Omit<ApiAction, 'device'> & { device: Pick<Device, 'id'> })[], // Unfortunately, this nasty type is really needed
  meta: ApiMeta
): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/routines/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      actions,
      meta
    })
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Execute a routine by id
 *
 * @param id The routine id
 * @returns The results of the routine's actions
 */
export async function execute_routine(id: string): ApiResponse<DeviceLog['result'][]> {
  const res = await fetch(`${BASE_URL}/routines/${id}/execute`, {
    method: 'PUT',
    body: JSON.stringify({}) // Idk, the API docs don't specify any parameters
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

/**
 * Delete a routine by id
 *
 * @param id The routine id
 * @returns Whether the deletion was successful
 */
export async function delete_routine(id: string): ApiResponse<boolean> {
  const res = await fetch(`${BASE_URL}/routines/${id}`, {
    method: 'DELETE'
  })
  const body = (await res.json()) as ApiResponse<any> | ApiError
  if (res.status >= 400 || 'error' in body) {
    throw body
  }
  return body
}

//#endregion
