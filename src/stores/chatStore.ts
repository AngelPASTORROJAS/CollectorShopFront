import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage } from '@/types'
import { ApiService } from '@/services/apiService'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)

  const fetchMessages = async (itemId: string) => {
    isLoading.value = true
    try {
      messages.value = await ApiService.getMessagesForItem(itemId)
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (
    itemId: string,
    senderId: string,
    receiverId: string,
    content: string,
  ) => {
    const newMsg = await ApiService.sendMessage({ itemId, senderId, receiverId, content })
    messages.value.push(newMsg)
  }

  return { messages, isLoading, fetchMessages, sendMessage }
})
