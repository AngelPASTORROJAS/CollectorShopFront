import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '@/views/CatalogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: CatalogView
    },
    {
      path: '/item/:id',
      name: 'item-detail',
      component: () => import('../views/ItemDetailView.vue')
    },
    {
      path: '/add-item',
      name: 'add-item',
      component: () => import('../views/AddItemView.vue')
    },
    {
      path: '/chat/:itemId',
      name: 'chat',
      component: () => import('../views/ChatView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView.vue') // Gère login + register sur la même vue
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/AuthView.vue')
    }
  ]
})

export default router
