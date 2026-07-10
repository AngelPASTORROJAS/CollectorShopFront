import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

// On mocke uniquement useRoute en conservant RouterLink et le reste du module
vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: vi.fn<() => unknown>(() => ({
      path: '/',
      meta: { isAuthPage: false }
    }))
  }
})

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: ['RouterLink', 'RouterView']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
