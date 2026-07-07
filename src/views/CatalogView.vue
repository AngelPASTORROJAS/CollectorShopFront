<script setup lang="ts">
import { onMounted } from 'vue'
import { useCatalogStore } from '@/stores/catalogStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const catalogStore = useCatalogStore()
const { validatedItems, isLoading } = storeToRefs(catalogStore)
const router = useRouter()

onMounted(() => {
  catalogStore.fetchItems()
})

const goToDetail = (id: string) => {
  router.push(`/item/${id}`)
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
        v-for="item in validatedItems"
        :key="item.id"
        class="card glass-panel"
        @click="goToDetail(item.id)"
      >
        <div class="card-image" :style="{ backgroundImage: `url(${item.imageUrl})` }">
          <span class="category-badge">{{ item.category }}</span>
        </div>
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p class="price">{{ item.price }} €</p>
          <div class="seller">Vendeur: {{ item.sellerName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  background: -webkit-linear-gradient(45deg, var(--color-text-primary), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  overflow: hidden;
  cursor: pointer;
  transition:
    transform var(--transition-speed),
    box-shadow var(--transition-speed);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);
  border-color: rgba(99, 102, 241, 0.5);
}

.card-image {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

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
}

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
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

.seller {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--color-text-secondary);
}
</style>
