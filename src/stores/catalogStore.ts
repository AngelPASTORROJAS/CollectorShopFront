import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CollectibleItem } from '@/types'
import { ApiService } from '@/services/apiService'

export const useCatalogStore = defineStore('catalog', () => {
  const items = ref<CollectibleItem[]>([])
  const isLoading = ref(false)

  const validatedItems = computed(() => items.value.filter((item) => item.status === 'validated'))

  const fetchItems = async () => {
    isLoading.value = true
    try {
      items.value = await ApiService.getItems()
    } finally {
      isLoading.value = false
    }
  }

  const addItem = async (itemData: Partial<CollectibleItem>) => {
    isLoading.value = true
    try {
      const newItem = await ApiService.createItem(itemData)
      items.value.push(newItem)
    } finally {
      isLoading.value = false
    }
  }

  return { items, validatedItems, isLoading, fetchItems, addItem }
})
