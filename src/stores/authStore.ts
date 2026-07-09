// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthUserDto } from '@/types/models'
import { ApiService } from '@/services/apiService' // Ou ton AuthResource

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUserDto | null>(null)
  const isAuthenticated = ref(false)
  const isCheckingAuth = ref(true) // Pour éviter les flashs d'interface pendant l'appel

  const checkAuth = async () => {
    isCheckingAuth.value = true
    try {
      // Cet appel envoie automatiquement le cookie au backend C#
      const currentUser = await ApiService.auth.getCurrentUser() // Ajuste selon ta méthode pour GET /api/auth/me
      user.value = currentUser
      isAuthenticated.value = true
    } catch (error) {
      // Cookie invalide ou expiré, on nettoie l'état
      user.value = null
      isAuthenticated.value = false
    } finally {
      isCheckingAuth.value = false
    }
  }

  return { user, isAuthenticated, isCheckingAuth, checkAuth }
})
