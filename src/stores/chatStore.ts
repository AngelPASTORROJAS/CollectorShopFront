import { defineStore } from 'pinia';
import { collectorAPI } from '@/api';
import type { ChatMessageDto } from '@/types/models';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessageDto[]
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
