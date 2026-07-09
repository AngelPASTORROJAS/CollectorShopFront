import { apiClient } from '../clients/apiClient';

export class ChatResource {
  async getMessagesAsync(itemId: number) {
    const { data } = await apiClient.get(`/api/chat/${itemId}`);
    return data;
  }

  async sendMessageAsync(itemId: number, payload: { ReceiverId: number; Content: string }) {
    const { data } = await apiClient.post(`/api/chat/${itemId}`, payload);
    return data;
  }
}
