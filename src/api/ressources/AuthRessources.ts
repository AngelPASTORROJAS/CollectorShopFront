import type { AuthUserDto, LoginRequest, RegisterRequest } from "@/types/models";
import { apiClient } from "../clients/apiClient";

export class AuthResource {
  /**
   * Connexion de l'utilisateur
   */
  public async loginAsync(payload: LoginRequest): Promise<boolean> {
    try {
      await apiClient.post("/api/auth/login", payload);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  public async registerAsync(payload: RegisterRequest): Promise<void> {
    // Si ton API C# renvoie des erreurs (ex: Email déjà pris),
    // l'intercepteur Axios les gérera ou elles remonteront jusqu'au Store
    await apiClient.post("/api/auth/register", payload);
  }

  /**
   * Déconnexion de l'utilisateur
   */
  public async logoutAsync(): Promise<void> {
    await apiClient.post("/api/auth/logout");
  }

  /**
   * Récupération du profil utilisateur connecté
   */
   public async getMeAsync(): Promise<AuthUserDto> {
       const response = await apiClient.get<AuthUserDto>("/api/auth/me");
       return response.data;
     }
}
