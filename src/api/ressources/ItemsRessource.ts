import { apiClient } from "../clients/apiClient";
import type { ItemRequest, ItemResponse } from "@/types/models";

export class ItemsResource {
  /**
   * Récupère la liste de tous les articles de la boutique
   */
  public async getAllAsync(): Promise<ItemResponse[]> {
    const response = await apiClient.get<ItemResponse[]>("/api/items");
    return response.data;
  }

  /**
   * Récupère les détails d'un article spécifique par son identifiant
   */
  public async getByIdAsync(id: number): Promise<ItemResponse> {
    const response = await apiClient.get<ItemResponse>(`/api/items/${id}`);
    return response.data;
  }

  /**
   * Crée un nouvel article (Action généralement protégée par rôle Admin côté C#)
   */
  public async createAsync(payload: ItemRequest): Promise<ItemResponse> {
    const response = await apiClient.post<ItemResponse>("/api/items", payload);
    return response.data;
  }

  /**
   * Met à jour un article existant
   */
  public async updateAsync(id: number, payload: ItemRequest): Promise<ItemResponse> {
    const response = await apiClient.put<ItemResponse>(`/api/items/${id}`, payload);
    return response.data;
  }

  /**
   * Supprime un article
   */
  public async deleteAsync(id: number): Promise<void> {
    await apiClient.delete(`/api/items/${id}`);
  }
}
