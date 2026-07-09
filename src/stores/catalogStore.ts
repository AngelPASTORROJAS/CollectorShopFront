import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CollectibleItemDto } from '@/types/models'
import { ApiService } from '@/services/apiService'

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref<CollectibleItemDto[]>([])
  const isLoading = ref(false)

  // On filtre sur AVAILABLE (au cas où, même si le SQL le fait déjà)
  const availableItems = computed(() =>
    items.value.filter((item) => item.Status === 'AVAILABLE')
  )

  const fetchItems = async () => {
    isLoading.value = true
    try {
      items.value = await ApiService.getItems() // Doit renvoyer un CollectibleItemDto[]
    } finally {
      isLoading.value = false
    }
  }

  return { items, availableItems, isLoading, fetchItems }
})
