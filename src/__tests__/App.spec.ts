import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import { useAuthStore } from '@/stores/authStore'

describe('App', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        component: { template: '<div>Home</div>' },
        meta: { isAuthPage: false }
      }
    ]
  })

  beforeEach(async () => {
    setActivePinia(createPinia())
    router.push('/')
    await router.isReady()
  })

  it('mounts renders properly', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const authStore = useAuthStore()
    authStore.isCheckingAuth = false
    authStore.isAuthenticated = false
    authStore.user = null

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
        stubs: {
          RouterLink: true,
          RouterView: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
  })
})
