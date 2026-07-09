<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest, RegisterRequest } from '@/types/models'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Détermine le mode d'affichage selon l'URL
const isLoginMode = computed(() => route.path === '/login')

// États des formulaires (respectant le PascalCase requis par ton API)
const loginData = ref<LoginRequest>({
  Email: '',
  Password: '',
  RememberMe: false
})

const registerData = ref<RegisterRequest>({
  BusinessName: '',
  Email: '',
  Password: '',
  ConfirmPassword: ''
})

const errorMessage = ref<string | null>(null)
const isLoading = ref<boolean>(false)

// Réinitialise les erreurs si on change d'onglet
watch(() => route.path, () => {
  errorMessage.value = null
})

async function handleSubmit() {
  if (isLoading.value) return
  errorMessage.value = null
  isLoading.value = true

  try {
    if (isLoginMode.value) {
      await authStore.loginAsync(loginData.value)
      router.push('/')
    } else {
      if (registerData.value.Password !== registerData.value.ConfirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas.")
      }
      await authStore.registerAsync(registerData.value)

      router.push('/login')
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card glass-panel">
      <h2>{{ isLoginMode ? 'Connexion' : 'Inscription' }}</h2>
      <p class="subtitle">
        {{ isLoginMode ? 'Ravi de vous revoir sur Collector.shop !' : 'Rejoignez la communauté de collectionneurs !' }}
      </p>

      <!-- Message d'erreur global -->
      <div v-if="errorMessage" class="alert error-alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Formulaire Inscription : Nom de l'entreprise -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="username">Nom de l'entreprise</label>
          <input
            type="text"
            id="username"
            v-model="registerData.BusinessName"
            placeholder="Ex: Ma Boutique Vintage"
            required
          />
        </div>

        <!-- Bloc Email -->
        <div class="form-group">
          <label for="email">Adresse Email</label>
          <input
            v-if="isLoginMode"
            type="email"
            id="email-login"
            v-model="loginData.Email"
            placeholder="votre@email.com"
            required
          />
          <input
            v-else
            type="email"
            id="email-register"
            v-model="registerData.Email"
            placeholder="votre@email.com"
            required
          />
        </div>

        <!-- Bloc Mot de passe -->
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            v-if="isLoginMode"
            type="password"
            id="password-login"
            v-model="loginData.Password"
            placeholder="••••••••"
            required
          />
          <input
            v-else
            type="password"
            id="password-register"
            v-model="registerData.Password"
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Formulaire Inscription : Confirmer le Mot de passe -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="registerData.ConfirmPassword"
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Formulaire Connexion : Se souvenir de moi -->
        <div v-if="isLoginMode" class="form-checkbox">
          <input type="checkbox" id="rememberMe" v-model="loginData.RememberMe" />
          <label for="rememberMe">Se souvenir de moi</label>
        </div>

        <!-- Bouton Soumettre -->
        <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
          <span v-if="isLoading">Chargement...</span>
          <span v-else>{{ isLoginMode ? 'Se connecter' : "Créer mon compte" }}</span>
        </button>
      </form>

      <!-- Lien de bascule sous le formulaire -->
      <div class="auth-toggle">
        <span v-if="isLoginMode">
          Nouveau sur Collector.shop ?
          <router-link to="/register" class="link">Créer un compte</router-link>
        </span>
        <span v-else>
          Déjà un compte ?
          <router-link to="/login" class="link">Se connecter</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100dvh - 80px);
  width: 100%;
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  padding: 2rem; /* Réduit pour gagner de la hauteur */
  border-radius: var(--border-radius);
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
}

.subtitle {
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
}

.form-group input {
  padding: 0.65rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.w-full {
  width: 100%;
}

.auth-toggle {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
}

.error-alert {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgb(239, 68, 68);
  color: #fca5a5;
}
</style>
