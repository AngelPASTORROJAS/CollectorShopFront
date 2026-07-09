import axios from 'axios'
import { API_CONFIG } from '../config/apiConfig'
import Swal from 'sweetalert2'

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // INDISPENSABLE : ordonne à Axios d'inclure et d'accepter le cookie HTTP-Only
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Intercepteur de RÉPONSE uniquement (Plus besoin de l'intercepteur de requête JWT)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.Message || // Attention au PascalCase imposé par ton API C# !
      error.response?.data?.Title ||
      'Une erreur est survenue.'

    if (status === 401) {
      await Swal.fire({
        icon: 'warning',
        title: 'Session expirée',
        text: 'Merci de vous reconnecter.',
      })
      // Optionnel : rediriger vers le login ici si tu n'utilises pas les guards de vue-router
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
