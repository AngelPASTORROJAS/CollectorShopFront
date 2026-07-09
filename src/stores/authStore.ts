// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AuthUserDto, LoginRequest, RegisterRequest } from '@/types/models'
import { collectorAPI } from '@/api' // On utilise directement ton instance d'API exportée

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUserDto | null>(null)
  const isAuthenticated = ref(false)
  const isCheckingAuth = ref(true)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 1. Vérification automatique de la session (au chargement / F5)
   */
  const checkAuth = async () => {
    isCheckingAuth.value = true
    try {
      // Appelle GET /api/auth/me via ton AuthResource
      const currentUser = await collectorAPI.auth.getMeAsync()
      user.value = currentUser
      isAuthenticated.value = true
    } catch (err) {
      // Si le cookie est absent/expiré (401), on reset le store tranquillement sans crash
      user.value = null
      isAuthenticated.value = false
    } finally {
      isCheckingAuth.value = false
    }
  }

  /**
   * 2. Connexion manuelle (Formulaire de login)
   */
  const loginAsync = async (payload: LoginRequest): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      // Appelle POST /api/auth/login
      const success = await collectorAPI.auth.loginAsync(payload)

      if (success) {
        // Si le login passe, le cookie est posé. On va chercher le profil
        await checkAuth()
      } else {
        throw new Error('Identifiants invalides.')
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la connexion.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 3. Inscription d'un nouvel utilisateur
   */
  const registerAsync = async (payload: RegisterRequest): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      await collectorAPI.auth.registerAsync(payload)
    } catch (err: any) {
      error.value = err.message || "Erreur lors de l'inscription."
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 4. Déconnexion
   */
  const logout = async (): Promise<void> => {
    try {
      await collectorAPI.auth.logoutAsync()
    } catch (err) {
      console.error('Erreur lors de la déconnexion backend', err)
    } finally {
      // Nettoyage complet de l'état côté client, peu importe le résultat de la requête
      user.value = null
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
    isLoading,
    error,
    checkAuth,
    loginAsync,
    registerAsync,
    logout
  }
})
