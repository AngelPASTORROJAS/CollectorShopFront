// Payload pour la création ou modification d'un article
export interface ItemRequest {
  Title: string;
  Description: string;
  Price: number;
  StockQuantity: number;
  ImageUrl?: string;
}

export interface ItemResponse {
  Id: number;
  Title: string;
  Description: string;
  Price: number;
  StockQuantity: number;
  ImageUrl: string;
  CreatedAt: string;
}

export interface LoginRequest {
  Email: string;
  Password: string;
  RememberMe?: boolean;
}

// Corrigé pour correspondre au record C# RegisterRequest
export interface RegisterRequest {
  BusinessName: string; // Remplacé Username par BusinessName
  Email: string;
  Password: string;
  ConfirmPassword?: string; // Optionnel (utilisé uniquement côté Front pour la validation)
}

// Correspond au record C# AuthUserDto
export interface AuthUserDto {
  Id: number;
  BusinessName?: string; // Selon ce que ton /api/auth/me renvoie en plus de l'Id
  Email?: string;
}
