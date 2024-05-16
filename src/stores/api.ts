import { ref, type Ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { get_homes, get_rooms, get_devices } from '@/api'

export const useHouseDataStore = defineStore('api_data', () => {
  const data: Ref<{
    homes: { name: string; code: string }[]
    rooms: { name: string; code: string }[]
    devices: any[]
  } | null> = ref(null)
  const loading = ref(false)
  const error = ref(false)

  async function updateData() {
    loading.value = true

    try {
      // data.value = {
      //   homes: (await get_homes()) as { name: string; code: string }[],
      //   rooms: (await get_rooms()) as { name: string; code: string }[],
      //   devices: (await get_devices()) as any[]
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
            name: 'Luz',
            code: 'abc123'
          },
          {
            name: 'Ventilador',
            code: 'def456'
          },
          {
            name: 'Calefactor',
            code: 'ghi789'
          }
        ]
      }
    } catch (e) {
      console.error(e)
      error.value = true
    }

    loading.value = false
  }

  return { data, loading, error, updateData }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHouseDataStore, import.meta.hot))
}
