import { createRouter, createWebHistory } from 'vue-router'
import CatalogView from '@/views/CatalogView.vue'
import { useAuthStore } from '@/stores/authStore'

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
      component: () => import('../views/AddItemView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat/:itemId',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView.vue'),
      meta: { isAuthPage: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/AuthView.vue'),
      meta: { isAuthPage: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.isCheckingAuth) {
    await authStore.checkAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  }
  else if (to.meta.isAuthPage && authStore.isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})

export default router
