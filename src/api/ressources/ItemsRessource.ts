import { apiClient } from "../clients/apiClient";
import type { CollectibleItemDto, ItemCreateDto } from "@/types/models";

export class ItemsResource {
  /**
   * Récupère la liste de tous les articles du catalogue (via api_load_catalog_ram)
   */
  public async getAllAsync(): Promise<CollectibleItemDto[]> {
    const response = await apiClient.get<CollectibleItemDto[]>("/api/items");
    return response.data;
  }

  /**
   * Récupère les détails d'un article par son identifiant unique
   */
  public async getByIdAsync(id: number): Promise<CollectibleItemDto> {
    const response = await apiClient.get<CollectibleItemDto>(`/api/items/${id}`);
    return response.data;
  }

  /**
   * Crée un nouvel article de collection (génère un ID côté DB)
   */
  public async createAsync(payload: ItemCreateDto): Promise<number> {
    // Ton API C# retourne l'ID long créé ou -1
    const response = await apiClient.post<number>("/api/items", payload);
    return response.data;
  }

  /**
   * Supprime logiciellement (soft delete) un article
   */
  public async deleteAsync(id: number): Promise<boolean> {
    const response = await apiClient.delete<boolean>(`/api/items/${id}`);
    return response.data;
  }
}
