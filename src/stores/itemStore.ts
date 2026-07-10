import { defineStore } from "pinia";
import { ref } from "vue";
import { collectorAPI } from "@/api";
import type { CollectibleItemDto } from "@/types/models";

export const useItemStore = defineStore("item", () => {
  const items = ref<CollectibleItemDto[]>([]);
  const isLoading = ref<boolean>(false);

  async function fetchItems() {
    isLoading.value = true;
    try {
      // Pas de gestion de token, l'appel est propre, sécurisé et transparent
      items.value = await collectorAPI.items.getAllAsync();
    } catch (error) {
      console.error("Erreur lors de la récupération des articles", error);
    } finally {
      isLoading.value = false;
    }
  }

  return { items, isLoading, fetchItems };
});
