import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { compression } from 'vite-plugin-compression2'
import obfuscator from 'vite-plugin-javascript-obfuscator'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    compression({
      algorithms: ['brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/]
    }),
    obfuscator({
      options: {
        compact: true,
        controlFlowFlattening: false,
        stringArray: false,
        stringArrayThreshold: 0.75
      }
    })
    ],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  preview: {
    port: 4173,
    headers: {
      // 1. Anti-clickjacking [10020]
      'X-Frame-Options': 'DENY',

      // 2. X-Content-Type-Options [10021]
      'X-Content-Type-Options': 'nosniff',

      // 3. Content Security Policy (CSP) [10038]
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;",

      // 4. Storable but Non-Cacheable Content [10049]
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',

      // 5. Permissions Policy [10063]
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',

      // 6. Cross-Origin-Embedder-Policy [90004]
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  }
})
