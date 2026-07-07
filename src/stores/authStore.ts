import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { ApiService } from '@/services/apiService'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const login = async (email: string) => {
    isLoading.value = true
    error.value = null
    try {
      const user = await ApiService.login(email)
      if (user) {
        currentUser.value = user
      } else {
        error.value = 'Utilisateur introuvable'
      }
    } catch (e) {
      error.value = 'Erreur lors de la connexion'
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
  }

  return { currentUser, isLoading, error, login, logout }
})
