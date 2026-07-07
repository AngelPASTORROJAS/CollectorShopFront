<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCatalogStore } from '@/stores/catalogStore'

const router = useRouter()
const authStore = useAuthStore()
const catalogStore = useCatalogStore()

const formData = ref({
  title: '',
  category: 'Figurines',
  price: 0,
  shippingCost: 0,
  description: '',
  imageUrl:
    'https://images.unsplash.com/photo-1584984647265-f485746b8969?auto=format&fit=crop&q=80&w=800',
})

const isSubmitting = ref(false)

const submitForm = async () => {
  if (!authStore.currentUser) return
  isSubmitting.value = true

  await catalogStore.addItem({
    ...formData.value,
    sellerId: authStore.currentUser.id,
    sellerName: authStore.currentUser.name,
  })

  isSubmitting.value = false
  // Simule l'US-04: L'article passe d'abord en "pending" coté back, on redirige vers l'accueil.
  alert('Votre article a été soumis avec succès ! Il sera visible après modération.')
  router.push('/')
}
</script>

<template>
  <div class="add-item-page animate-fade-in">
    <div v-if="!authStore.currentUser" class="text-center">
      <h2>Accès Refusé</h2>
      <p>Vous devez être connecté pour proposer un objet à la vente.</p>
    </div>

    <div v-else class="form-container glass-panel">
      <h2>Mettre un objet en vente</h2>
      <p class="subtitle">Détaillez votre article pour rassurer les acheteurs.</p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">Titre de l'objet</label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input"
            required
            placeholder="Ex: Figurine Batman 1989"
          />
        </div>

        <div class="form-row">
          <div class="form-group w-full">
            <label class="form-label">Catégorie</label>
            <select v-model="formData.category" class="form-input" required>
              <option>Figurines</option>
              <option>Sneakers</option>
              <option>Jeux Vidéo</option>
              <option>Cartes à collectionner</option>
              <option>Autre</option>
            </select>
          </div>

          <div class="form-group w-full">
            <label class="form-label">Prix (€)</label>
            <input
              v-model="formData.price"
              type="number"
              min="1"
              step="0.5"
              class="form-input"
              required
            />
          </div>

          <div class="form-group w-full">
            <label class="form-label">Frais de port (€)</label>
            <input
              v-model="formData.shippingCost"
              type="number"
              min="0"
              step="0.5"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description détaillée</label>
          <textarea
            v-model="formData.description"
            class="form-textarea"
            required
            placeholder="Décrivez l'état, l'année, les défauts éventuels..."
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">URL de l'image (Simulation pour POC)</label>
          <input v-model="formData.imageUrl" type="url" class="form-input" required />
        </div>

        <div class="actions">
          <button type="button" class="btn btn-outline" @click="router.back()">Annuler</button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Envoi en cours...' : 'Proposer à la vente' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;
}

.form-container h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.w-full {
  flex: 1;
}

select.form-input {
  appearance: none;
  background-color: rgba(0, 0, 0, 0.4);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.text-center {
  text-align: center;
  padding: 4rem 0;
}
</style>
