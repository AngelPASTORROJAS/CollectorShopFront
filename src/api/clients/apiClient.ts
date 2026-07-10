import axios from 'axios'
import { API_CONFIG } from '../config/apiConfig'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore'

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.Message ||
      error.response?.data?.Title ||
      'Une erreur est survenue.'

    if (status === 401) {
      // 2. On récupère l'instance du store d'authentification à la volée
      const authStore = useAuthStore()

      // 3. On n'affiche la pop-up QUE si l'application considérait que l'utilisateur était connecté
      if (authStore.isAuthenticated) {
        await Swal.fire({
          icon: 'warning',
          title: 'Session expirée',
          text: 'Merci de vous reconnecter.',
        })

        // Optionnel : Tu peux forcer le nettoyage du store ici si nécessaire
        authStore.logout()
      }
    } else if (status === 403) {
      await Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: "Vous n'avez pas les droits nécessaires pour effectuer cette action.",
      })
    } else if (status === 400) {
      await Swal.fire({
        icon: 'error',
        title: 'Requête invalide',
        text: message,
      })
    }

    return Promise.reject(error)
  },
)
