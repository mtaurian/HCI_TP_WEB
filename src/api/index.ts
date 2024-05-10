const BASE_URL = 'http://localhost:8080'

//#region All devices

/**
 * Retrieve all devices
 *
 * @returns
 */
export async function get_devices(): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices`)).json()
}

/**
 * Retrieve all device of a specific type
 *
 * @param type The device type id to filter by
 * @returns
 */
export async function get_devices_by_type(type: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/devicetype/${type}`)).json()
}

/**
 * Retrieve logs for all devices
 *
 * @param limit The number of logs to retrieve
 * @param offset The offset to start retrieving logs from
 * @returns
 */
export async function retrieve_all_logs(limit: number, offset: number): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/logs/${limit}/offset/${offset}`)).json()
}

/**
 * Retrieve events for all devices
 *
 * @returns
 */
export async function retrieve_all_events(): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/events`)).json()
}

//#endregion

//#region Device

/**
 * Add a new device
 *
 * @param type_id The new device type
 * @param name The new device name
 * @param meta The new device metadata
 * @returns
 */
export async function add_device(
  type_id: string,
  name: string,
  meta: Record<string | number, any>
): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/devices`, {
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
  ).json()
}

/**
 * Retrieve a device by id
 *
 * @param id The device id
 * @returns
 */
export async function get_device(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/${id}`)).json()
}

/**
 * Update a device by id
 *
 * @param id The device id
 * @param name The new device name
 * @param meta The new device metadata
 * @returns
 */
export async function update_device(id: string, name: string, meta: Record<string, any>) {
  return (
    await fetch(`${BASE_URL}/devices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        meta
      })
    })
  ).json()
}

/**
 * Delete a device by id
 *
 * @param id The device id
 * @returns
 */
export async function delete_device(id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/devices/${id}`, {
      method: 'DELETE'
    })
  ).json()
}

/**
 * Retrieve a single device's state
 *
 * @param id The device id
 * @returns
 */
export async function get_device_state(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/${id}/state`)).json()
}

/**
 * Retrieve a single device's actions
 *
 * @param id The device id
 * @returns
 */
export async function get_device_events(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/${id}/events`)).json()
}

/**
 * Retrieve a single device's logs
 *
 * @param id The device id
 * @param limit The number of logs to retrieve
 * @param offset The offset to start retrieving logs from
 * @returns
 */
export async function get_device_logs(id: string, limit: number, offset: number): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devices/${id}/logs/limit/${limit}/offset/${offset}`)).json()
}

/**
 * Execute a device's actions by id and action name
 *
 * @param id The device id
 * @param action The action name to execute
 * @param params The action parameters
 * @returns
 */
export async function execute_device_action(
  id: string,
  action: string,
  params: Record<string, any>
): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/devices/${id}/${action}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
  ).json()
}

//#endregion

//#region Device Type

/**
 * Retrieve all device types
 *
 * @note I strongly recommend NOT using this method in the code.
 * It's main purpose is for us to discover how the API works.
 *
 * @returns
 */
export async function get_device_types(): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devicetypes`)).json()
}

/**
 * Retrieve a device type by id
 *
 * @hint This might be really usefull for routine creation.
 *
 * @param id The device type id
 * @returns
 */
export async function get_device_type(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/devicetypes/${id}`)).json()
}

//#endregion

//#region Home

/**
 * Retrieve all homes
 *
 * @returns
 */
export async function get_homes(): Promise<unknown> {
  return (await fetch(`${BASE_URL}/homes`)).json()
}

/**
 * Add a new home
 *
 * @param name The new home name
 * @param meta The new home metadata
 * @returns
 */
export async function add_home(name: string, meta: Record<string, any>): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/homes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        meta
      })
    })
  ).json()
}

/**
 * Retrieve a home by id
 *
 * @param id The home id
 * @returns
 */
export async function get_home(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/homes/${id}`)).json()
}

/**
 * Update a home by id
 *
 * @param id The home id
 * @param name The new home name
 * @param meta The new home metadata
 * @returns
 */
export async function update_home(
  id: string,
  name: string,
  meta: Record<string, any>
): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/homes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        meta
      })
    })
  ).json()
}

/**
 * Delete a home by id
 *
 * @param id The home id
 * @returns
 */
export async function delete_home(id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/homes/${id}`, {
      method: 'DELETE'
    })
  ).json()
}

//#endregion

//#region Room

/**
 * Get all rooms
 *
 * @note NOT recommended to use in the code. At least not for our design.
 *
 * @returns
 */
export async function get_rooms(): Promise<unknown> {
  return (await fetch(`${BASE_URL}/rooms`)).json()
}

/**
 * Add a new room
 *
 * @param name The new room name
 * @param meta The new room metadata
 * @returns
 */
export async function add_room(name: string, meta: Record<string, unknown>): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        meta
      })
    })
  ).json()
}

/**
 * Retrieve a room by id
 *
 * @param id The room id
 * @returns
 */
export async function get_room(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/rooms/${id}`)).json()
}

/**
 * Update a room by id
 *
 * @param id The room id
 * @param name The new room name
 * @param meta The new room metadata
 * @returns
 */
export async function update_room(
  id: string,
  name: string,
  meta: Record<string, unknown>
): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        meta
      })
    })
  ).json()
}

/**
 * Delete a room by id
 *
 * @param id The room id
 * @returns
 */
export async function delete_room(id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/rooms/${id}`, {
      method: 'DELETE'
    })
  ).json()
}

//#endregion

//#region Home-Room Relationship

/**
 * Retrieve all rooms in a home
 *
 * @param home_id The home id
 * @returns
 */
export async function get_home_rooms(home_id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/homes/${home_id}/rooms`)).json()
}

/**
 * Add an EXISTING room to a home
 *
 * @param home_id The home id
 * @param room_id The room id
 * @returns
 */
export async function add_room_to_home(home_id: string, room_id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/homes/${home_id}/rooms/${room_id}`, {
      method: 'POST'
    })
  ).json()
}

/**
 * Remove a room from a home
 *
 * @param room_id The room id
 * @returns
 */
export async function remove_room_from_home(room_id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/homes/rooms/${room_id}`, {
      method: 'DELETE'
    })
  ).json()
}

//#endregion

//#region Room-Device Relationship

/**
 * Retrieve all devices in a room
 *
 * @param room_id The room id
 * @returns
 */
export async function get_room_devices(room_id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/rooms/${room_id}/devices`)).json()
}

/**
 * Add an EXISTING device to a room
 *
 * @param room_id The room id
 * @param device_id The device id
 * @returns
 */
export async function add_device_to_room(room_id: string, device_id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/rooms/${room_id}/devices/${device_id}`, {
      method: 'POST'
    })
  ).json()
}

/**
 * Remove a device from a room
 *
 * @param device_id The device id
 * @returns
 */
export async function remove_device_from_room(device_id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/rooms/devices/${device_id}`, {
      method: 'DELETE'
    })
  ).json()
}

/**
 * Change a device's room
 *
 * @note Not API native. This is a helper function.
 *
 * @param device_id The device id
 * @param room_id The new room id
 * @returns
 */
export async function change_device_room(device_id: string, room_id: string): Promise<unknown> {
  await remove_device_from_room(device_id)
  return add_device_to_room(room_id, device_id)
}

//#endregion

//#region Routine

/**
 * Retrieve all routines
 *
 * @returns
 */
export async function get_routines(): Promise<unknown> {
  return (await fetch(`${BASE_URL}/routines`)).json()
}

/**
 * Add a new routine
 *
 * @param name The new routine name
 * @param actions The new routine actions
 * @param meta The new routine metadata
 * @returns
 */
export async function add_routine(
  name: string,
  actions: Array<{
    device: { id: string }
    actionName: string
    params: unknown[]
    meta: Record<string, unknown>
  }>,
  meta: Record<string, unknown>
): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/routines`, {
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
  ).json()
}

/**
 * Retrieve a routine by id
 *
 * @param id The routine id
 * @returns
 */
export async function get_routine(id: string): Promise<unknown> {
  return (await fetch(`${BASE_URL}/routines/${id}`)).json()
}

/**
 * Update a routine by id
 *
 * @param id The routine id
 * @param name The new routine's name
 * @param actions The new routine's actions
 * @param meta The new routine's metadata
 * @returns
 */
export async function update_routine(
  id: string,
  name: string,
  actions: Array<{
    device: { id: string }
    actionName: string
    params: unknown[]
    meta: Record<string, unknown>
  }>,
  meta: Record<string, unknown>
): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/routines/${id}`, {
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
  ).json()
}

/**
 * Execute a routine by id
 *
 * @param id The routine id
 * @returns
 */
export async function execute_routine(id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/routines/${id}/execute`, {
      method: 'PUT',
      body: JSON.stringify({}) // Idk, the API docs don't specify any parameters
    })
  ).json()
}

/**
 * Delete a routine by id
 *
 * @param id The routine id
 * @returns
 */
export async function delete_routine(id: string): Promise<unknown> {
  return (
    await fetch(`${BASE_URL}/routines/${id}`, {
      method: 'DELETE'
    })
  ).json()
}

//#endregion

//#region JSON-TO-TS

export interface Device {
  id: string
  name: string
  powerUsage: number
  actions: Action[]
  events: Event[]
}

export interface Action {
  name: string
  params: Param[]
  return: {
    type: string
    description: string
    example: unknown
  }
}

export interface Param {
  name: string
  type: string
  description: string
  minValue: string | number
  maxValue: string | number
  example: string | number
  supportedValues?: string[]
}

export interface Event {
  name: string
  args: {
    type: string
    description: string
    example: Example
  }
}

export type Example =
  | Record<string, string | number>
  | {
      newSong?: {
        title: string
        artist: string
        album: string
        duration: string
      }
    }

//#endregion
