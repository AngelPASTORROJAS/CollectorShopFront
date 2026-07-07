import type { ChatMessage, CollectibleItem, User } from '@/types'
import { mockItems, mockUsers, mockMessages } from './mocks/data'

// Faux délai réseau pour simuler un appel HTTP
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Cette classe sera facilement remplaçable par des appels Axios plus tard
export const ApiService = {
  // --- CATALOGUE ---
  async getItems(): Promise<CollectibleItem[]> {
    await delay(500)
    return [...mockItems]
  },

  async getItemById(id: string): Promise<CollectibleItem | undefined> {
    await delay(300)
    return mockItems.find((item) => item.id === id)
  },

  async createItem(itemData: Partial<CollectibleItem>): Promise<CollectibleItem> {
    await delay(800)
    const newItem: CollectibleItem = {
      ...itemData,
      id: 'i' + Math.random().toString(36).substr(2, 9),
      status: 'pending', // Validation admin requise (US-04)
      createdAt: new Date().toISOString(),
    } as CollectibleItem
    mockItems.push(newItem)
    return newItem
  },

  // --- AUTH ---
  async login(email: string): Promise<User | null> {
    await delay(600)
    const user = mockUsers.find((u) => u.email === email)
    return user || null
  },

  // --- CHAT ---
  async getMessagesForItem(itemId: string): Promise<ChatMessage[]> {
    await delay(400)
    return mockMessages
      .filter((m) => m.itemId === itemId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },

  async sendMessage(msg: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> {
    await delay(300)
    const newMsg: ChatMessage = {
      ...msg,
      id: 'm' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    }
    mockMessages.push(newMsg)
    return newMsg
  },
}
