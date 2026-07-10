import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

// On mocke vue-router de manière isolée avec l'utilitaire "vi"
vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ path: '/' }))
}))

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
