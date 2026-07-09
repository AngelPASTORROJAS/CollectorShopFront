import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CollectibleItemDto } from '@/types/models'
import { collectorAPI } from '@/api' // <-- Utilise ton instance d'API globale unifiée

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref<CollectibleItemDto[]>([])
  const isLoading = ref(false)

  const availableItems = computed(() =>
    items.value.filter((item) => item.Status === 'AVAILABLE')
  )

  const fetchItems = async () => {
    isLoading.value = true
    try {
      items.value = await collectorAPI.items.getAllAsync()
    } catch (error) {
      console.error("Erreur lors de la récupération du catalogue :", error)
    } finally {
      isLoading.value = false
    }
  }

  return { items, availableItems, isLoading, fetchItems }
})
