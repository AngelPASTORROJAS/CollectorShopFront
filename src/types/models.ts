// Payload pour l'authentification
export interface LoginRequest {
  Email: string;
  Password: string;
  RememberMe?: boolean;
}

export interface RegisterRequest {
  BusinessName: string;
  Email: string;
  Password: string;
  ConfirmPassword?: string; // Côté Vue uniquement pour la validation
}

export interface AuthUserDto {
  Id: number;
  BusinessName?: string;
  Email?: string;
}

// ---- NOUVEAUX TYPES COLLECTOR ----

// Correspond à CollectibleItemDto
export interface CollectibleItemDto {
  Id: number;
  CategoryCode: string;
  OwnerId: number;
  Title: string;
  Description: string;
  Price: number;
  Status: string;
  MetadataJson: string; // JSON stringifié
}

// Correspond à ItemCreateDto (Payload envoyé pour la création)
export interface ItemCreateDto {
  CategoryCode: string;
  Title: string;
  Description: string;
  Price: number;
  MetadataJson?: string;
}

// Correspond à ChatMessageDto
export interface ChatMessageDto {
  Id: number;
  ItemId: number;
  SenderId: number;
  ReceiverId: number;
  Content: string;
  CreatedAt: string; // Représente le DateTime C# au format ISO string
}

// Correspond à ChatSendMessageDto
export interface ChatSendMessageDto {
  ReceiverId: number;
  Content: string;
}
