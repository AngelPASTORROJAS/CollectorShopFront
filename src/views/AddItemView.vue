<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collectorAPI } from '@/api'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Utilisation des propriétés en PascalCase pour le DTO de création
const formData = ref({
  Title: '',
  CategoryCode: 'Figurines',
  Price: 0,
  Description: '',
})

const isSubmitting = ref(false)

const submitForm = async () => {
  if (!authStore.user?.Id) return
  isSubmitting.value = true

  try {
    // Appel direct à l'API via le pattern collectorAPI.items
    await collectorAPI.items.createAsync(formData.value)

    alert('Votre article a été soumis avec succès !')
    router.push('/')
  } catch (error) {
    console.error("Erreur création :", error)
    alert("Une erreur est survenue lors de la soumission.")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="add-item-page animate-fade-in">
    <div v-if="!authStore.isAuthenticated" class="text-center">
      <h2>Accès Refusé</h2>
      <p>Vous devez être connecté pour proposer un objet à la vente.</p>
    </div>

    <div v-else class="form-container glass-panel">
      <h2>Mettre un objet en vente</h2>
      <p class="subtitle">Détaillez votre article pour rassurer les acheteurs.</p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">Titre de l'objet</label>
          <input v-model="formData.Title" type="text" class="form-input" required placeholder="Ex: Figurine Batman 1989" />
        </div>

        <div class="form-row">
          <div class="form-group w-full">
            <label class="form-label">Catégorie</label>
            <select v-model="formData.CategoryCode" class="form-input" required>
              <option value="Figurines">Figurines</option>
              <option value="Sneakers">Sneakers</option>
              <option value="Jeux Vidéo">Jeux Vidéo</option>
              <option value="Cartes">Cartes à collectionner</option>
            </select>
          </div>

          <div class="form-group w-full">
            <label class="form-label">Prix (€)</label>
            <input v-model="formData.Price" type="number" min="1" step="0.5" class="form-input" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description détaillée</label>
          <textarea v-model="formData.Description" class="form-textarea" required></textarea>
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

<style lang="scss" scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;

  h2 { font-size: 2rem; margin-bottom: 0.5rem; }
  .subtitle { color: var(--color-text-secondary); margin-bottom: 2rem; }

  .form-row {
    display: flex;
    gap: 1.5rem;
    .w-full { flex: 1; }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
  }
}

.text-center { text-align: center; padding: 4rem 0; }
</style>
