export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
}

export interface CollectibleItem {
  id: string;
  title: string;
  description: string;
  price: number;
  shippingCost: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string;
  status: 'pending' | 'validated' | 'sold';
  createdAt: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  itemId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}
