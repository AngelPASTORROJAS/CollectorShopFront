<script setup lang="ts">
import { onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalogStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { collectorAPI } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const catalogStore = useCatalogStore()
const { availableItems, isLoading } = storeToRefs(catalogStore)
const router = useRouter()

onMounted(() => {
  catalogStore.fetchItems()
})

const goToDetail = (id: number) => {
  router.push(`/item/${id}`)
}

const deleteItem = async (event: Event, id: number) => {
  event.stopPropagation()

  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  })

  if (result.isConfirmed) {
    try {
      const success = await collectorAPI.items.deleteAsync(id)
      if (success) {
        await catalogStore.fetchItems()
        Swal.fire('Supprimé !', 'Votre article a été retiré.', 'success')
      }
    } catch (error) {
      console.error("Erreur suppression :", error)
      Swal.fire('Erreur', 'Impossible de supprimer l\'article.', 'error')
    }
  }
}

</script>

<template>
  <div class="catalog-page animate-fade-in">
    <div class="header">
      <h1>Objets de Collection</h1>
      <p>Découvrez des pièces uniques de passionnés.</p>
    </div>

    <div v-if="isLoading" class="loading">Chargement du catalogue...</div>

    <div v-else class="grid">
      <div
        v-for="item in availableItems"
        :key="item.Id"
        class="card glass-panel"
        @click="goToDetail(item.Id)"
      >
        <!-- Simulation d'une image ou extraction depuis MetadataJson si besoin, sinon placeholder pour le POC -->
        <div class="card-image" style="background-image: url('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500')">
          <span class="category-badge">{{ item.CategoryCode || 'Collection' }}</span>
        </div>
        <div class="card-content">
          <h3>{{ item.Title }}</h3>
          <p class="price">{{ item.Price }} €</p>
          <!-- Note : Sera vide tant que le SQL ne l'inclut pas, mais le DTO est prêt -->
          <p v-if="item.Description" class="description">{{ item.Description }}</p>
          <div class="seller">Propriétaire #{{ item.OwnerId }}</div>

          <button
            v-if="authStore.user?.Id === item.OwnerId"
            class="btn-delete"
            @click="deleteItem($event, item.Id)"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.catalog-page {
  .header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      background: -webkit-linear-gradient(45deg, var(--color-text-primary), var(--color-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: var(--color-text-secondary);
      font-size: 1.1rem;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .card {
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition-speed), box-shadow var(--transition-speed);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
      border-color: rgba(99, 102, 241, 0.5);
    }

    .card-image {
      height: 200px;
      background-size: cover;
      background-position: center;
      position: relative;

      .category-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-transform: uppercase;
      }
    }

    .card-content {
      padding: 1.5rem;

      h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .price {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-accent);
        margin-bottom: 0.5rem;
      }

      .description {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        margin-bottom: 0.75rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .seller {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }
  }

  .loading {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: var(--color-text-secondary);
  }
}
</style>
