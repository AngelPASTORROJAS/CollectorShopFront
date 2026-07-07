import type { CollectibleItem, User, ChatMessage } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Vintage',
    email: 'alice@test.com',
    role: 'seller',
    avatar: 'https://i.pravatar.cc/150?u=u1',
  },
  {
    id: 'u2',
    name: 'Bob Collector',
    email: 'bob@test.com',
    role: 'buyer',
    avatar: 'https://i.pravatar.cc/150?u=u2',
  },
]

export const mockItems: CollectibleItem[] = [
  {
    id: 'i1',
    title: 'Figurine Star Wars Originale 1977',
    description:
      "Figurine Luke Skywalker dans son emballage d'origine, jamais ouverte. Légère usure sur le coin supérieur gauche de la boîte.",
    price: 450.0,
    shippingCost: 15.0,
    sellerId: 'u1',
    sellerName: 'Alice Vintage',
    imageUrl:
      'https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&q=80&w=800',
    status: 'validated',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'Figurines',
  },
  {
    id: 'i2',
    title: 'Baskets Nike Air Jordan 1 Retro',
    description:
      'Édition limitée de 2015, portées une seule fois. État impeccable, vendues avec la boîte.',
    price: 320.0,
    shippingCost: 10.0,
    sellerId: 'u1',
    sellerName: 'Alice Vintage',
    imageUrl:
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800',
    status: 'validated',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: 'Sneakers',
  },
  {
    id: 'i3',
    title: 'Game Boy Classic avec Tetris',
    description:
      'Console Nintendo Game Boy de 1989. Fonctionne parfaitement, écran sans rayures. Jeu Tetris inclus.',
    price: 150.0,
    shippingCost: 8.0,
    sellerId: 'u2',
    sellerName: 'Bob Collector',
    imageUrl:
      'https://images.unsplash.com/photo-1531525645387-7f14be1bfc3d?auto=format&fit=crop&q=80&w=800',
    status: 'validated',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    category: 'Jeux Vidéo',
  },
]

export const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    itemId: 'i1',
    senderId: 'u2',
    receiverId: 'u1',
    content: 'Bonjour, la boîte est-elle vraiment scellée ?',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'm2',
    itemId: 'i1',
    senderId: 'u1',
    receiverId: 'u2',
    content: "Oui tout à fait, les scellés d'usine sont intacts.",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
]
