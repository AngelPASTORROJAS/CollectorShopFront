import { defineStore } from 'pinia';
import { collectorAPI } from '@/api';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as unknown[]
  }),
  actions: {
    async fetchMessages(itemId: number) {
      this.messages = await collectorAPI.chat.getMessagesAsync(itemId);
    },
    async sendMessage(itemId: number, payload: { ReceiverId: number; Content: string }) {
      await collectorAPI.chat.sendMessageAsync(itemId, payload);
      await this.fetchMessages(itemId);
    }
  }
});
