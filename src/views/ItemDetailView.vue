<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApiService } from '@/services/apiService'
import type { CollectibleItem } from '@/types'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const item = ref<CollectibleItem | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  const id = route.params.id as string
  item.value = (await ApiService.getItemById(id)) || null
  isLoading.value = false
})

const contactSeller = () => {
  if (!authStore.currentUser) {
    alert('Veuillez vous connecter pour contacter le vendeur.')
    return
  }
  if (item.value) {
    router.push(`/chat/${item.value.id}`)
  }
}
</script>

<template>
  <div class="detail-page animate-fade-in" v-if="!isLoading && item">
    <button class="btn btn-outline mb-4" @click="router.back()">← Retour</button>

    <div class="content glass-panel">
      <div class="image-container">
        <img :src="item.imageUrl" :alt="item.title" />
      </div>

      <div class="info-container">
        <span class="badge">{{ item.category }}</span>
        <h1>{{ item.title }}</h1>
        <p class="price">
          {{ item.price }} € <span class="shipping">+ {{ item.shippingCost }} € livraison</span>
        </p>

        <div class="description-box">
          <h3>Description</h3>
          <p>{{ item.description }}</p>
        </div>

        <div class="seller-box">
          <p>
            Vendeur: <strong>{{ item.sellerName }}</strong>
          </p>
          <p class="date">En ligne depuis le {{ new Date(item.createdAt).toLocaleDateString() }}</p>
        </div>

        <div class="actions">
          <button
            v-if="authStore.currentUser?.id !== item.sellerId"
            class="btn btn-primary btn-large w-full"
            @click="contactSeller"
          >
            Contacter le vendeur
          </button>
          <div v-else class="owner-notice">Ceci est votre article.</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="isLoading" class="loading">Chargement...</div>
  <div v-else class="not-found">Article introuvable.</div>
</template>

<style scoped>
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
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.info-container {
  display: flex;
  flex-direction: column;
}

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

.shipping {
  font-size: 1rem;
  color: var(--color-text-secondary);
  font-weight: normal;
}

.description-box,
.seller-box {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
}

.description-box h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

.seller-box p {
  margin-bottom: 0.25rem;
}

.date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
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

.loading,
.not-found {
  text-align: center;
  padding: 3rem;
}
</style>
