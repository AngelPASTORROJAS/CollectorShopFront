<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { collectorAPI } from '@/api'
import type { CollectibleItemDto } from '@/types/models'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const item = ref<CollectibleItemDto | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    item.value = (await collectorAPI.items.getByIdAsync(id)) || null
  } catch (error) {
    console.error("Erreur lors de la récupération du détail de l'article :", error)
  } finally {
    isLoading.value = false
  }
})

const contactForItem = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (item.value) {
    router.push(`/chat/${item.value.Id}`)
  }
}

</script>

<template>
  <div class="detail-page animate-fade-in" v-if="!isLoading && item">
    <button class="btn btn-outline mb-4" @click="router.back()">← Retour</button>

    <div class="content glass-panel">
      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500" :alt="item.Title" />
      </div>

      <div class="info-container">
        <span class="badge">{{ item.CategoryCode || 'Collection' }}</span>
        <h1>{{ item.Title }}</h1>
        <p class="price">{{ item.Price }} €</p>

        <div class="description-box">
          <h3>Description</h3>
          <p>{{ item.Description || 'Aucune description fournie.' }}</p>
        </div>

        <div class="seller-box">
          <p>Propriétaire: <strong>#{{ item.OwnerId }}</strong></p>
          <p class="status-badge">Statut: {{ item.Status }}</p>
        </div>

        <div class="actions">
          <button
            class="btn btn-large w-full"
            :class="authStore.user?.Id !== item.OwnerId ? 'btn-primary' : 'btn-secondary'"
            @click="contactForItem"
          >
            {{ authStore.user?.Id !== item.OwnerId ? "Contacter le vendeur" : "Vérifier vos messages" }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isLoading" class="loading">Chargement...</div>
  <div v-else class="not-found">Article introuvable.</div>
</template>

<style lang="scss" scoped>
.detail-page {

  .mb-4 {
    margin-bottom: 1rem;
  }

  .w-full {
    width: 100%;
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .image-container {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--border-radius);
    }
  }

  .info-container {
    display: flex;
    flex-direction: column;

    .badge {
      align-self: flex-start;
      background: var(--color-primary);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: var(--color-text-primary);
    }

    .price {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-accent);
      margin-bottom: 2rem;
      display: flex;
      align-items: baseline;
      gap: 1rem;
    }

    .description-box,
    .seller-box {
      background: rgba(0, 0, 0, 0.2);
      padding: 1.5rem;
      border-radius: var(--border-radius);
      margin-bottom: 1.5rem;
    }

    .description-box {
      h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: var(--color-text-secondary);
      }
      p {
        color: var(--color-text-primary);
      }
    }

    .seller-box {
      p {
        margin-bottom: 0.25rem;
        color: var(--color-text-primary);
      }

      .status-badge {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }

    .btn-large {
      padding: 1rem 2rem;
      font-size: 1.1rem;
    }

    .owner-notice {
      text-align: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--border-radius);
      color: var(--color-text-secondary);
    }
  }
}

.loading,
.not-found {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}
</style>
