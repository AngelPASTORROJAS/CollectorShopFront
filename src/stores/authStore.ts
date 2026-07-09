import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginRequest, RegisterRequest } from '@/types/models'
import { collectorAPI } from '@/api'

// On définit l'interface User pour le front (adapter selon ce que retourne /api/auth/me)
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  /**
   * Connexion de l'utilisateur
   */
  const loginAsync = async (payload: LoginRequest): Promise<void> => {
    isLoading.value = true
    error.value = null
    try {
      // 1. Appel API : Le serveur valide et pose le cookie HTTP-Only
      const success = await collectorAPI.auth.loginAsync(payload)

      if (success) {
        // 2. On récupère le profil de l'utilisateur fraîchement connecté
        await fetchCurrentUserAsync()
      } else {
        error.value = 'Identifiants invalides.'
        throw new Error('Identifiants invalides.')
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erreur lors de la connexion'
      throw e // On propage l'erreur pour que le composant AuthView puisse l'intercepter
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
   const registerAsync = async (payload: RegisterRequest): Promise<void> => {
     isLoading.value = true
     error.value = null
     try {
       await collectorAPI.auth.registerAsync(payload)
     } catch (e: unknown) {
       error.value = e instanceof Error ? e.message : "Erreur lors de l'inscription"
       throw e
     } finally {
       isLoading.value = false
     }
   }

  /**
   * Récupère les données de l'utilisateur connecté
   */
   const fetchCurrentUserAsync = async (): Promise<void> => {
       try {
         const data = await collectorAPI.auth.getMeAsync()

         currentUser.value = {
           id: data.Id ?? (data as any).id, // Gère le PascalCase de C# ou le camelCase standard
           name: data.BusinessName ?? (data as any).businessName ?? 'Entreprise',
           email: data.Email ?? (data as any).email ?? ''
         }
       } catch {
         currentUser.value = null
       }
     }
  /**
   * Déconnexion
   */
  const logout = async (): Promise<void> => {
    try {
      await collectorAPI.auth.logoutAsync()
    } catch (e) {
      console.error('Erreur lors de la déconnexion backend', e)
    } finally {
      // Dans tous les cas, on nettoie le state côté front
      currentUser.value = null
    }
  }

  return {
    currentUser,
    isLoading,
    error,
    loginAsync,
    registerAsync,
    fetchCurrentUserAsync,
    logout
  }
})
