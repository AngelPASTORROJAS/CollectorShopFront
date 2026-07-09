<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const route = useRoute()

onMounted(async () => {
  await authStore.checkAuth()
})
</script>

<template>
  <div v-if="authStore.isCheckingAuth" class="app-loading">
    <div class="spinner"></div>
    <p>Chargement de la session...</p>
  </div>

  <div v-else class="app-container">
    <header class="navbar glass-panel">
      <div class="nav-container">
        <div class="logo">
          <RouterLink to="/">Collector.shop</RouterLink>
        </div>
        <nav class="nav-links">
          <RouterLink to="/" class="nav-link">Catalogue</RouterLink>
          <RouterLink v-if="authStore.isAuthenticated" to="/add-item" class="nav-link btn-sell">Vendre un objet</RouterLink>
        </nav>
        <div class="user-menu">
          <template v-if="authStore.isAuthenticated && authStore.user">
            <span class="user-name">{{ authStore.user.BusinessName || 'Entreprise' }}</span>
            <button @click="authStore.logout()" class="btn btn-secondary">Déconnexion</button>
          </template>
          <div v-else class="auth-buttons">
            <RouterLink to="/login" class="btn btn-secondary">Connexion</RouterLink>
            <RouterLink to="/register" class="btn btn-primary">S'inscrire</RouterLink>
          </div>
        </div>
      </div>
    </header>

    <main class="page-wrapper container" :class="route.meta.isAuthPage ? 'auth-layout' : 'standard-layout'">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  padding-top: 80px;
}

.page-wrapper {
  padding-top: 2rem;
  padding-bottom: 2rem;
  min-height: calc(100dvh - 80px);
}

.btn-sell {
    background: var(--color-primary);
    color: white !important;
    font-weight: 600;

    &:hover {
      background: var(--color-primary-hover);
    }
  }

/* Tes styles restent corrects, ils sont maintenant bien liés au template */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo a {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
    background: -webkit-linear-gradient(45deg, var(--color-primary), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .nav-links {
    display: flex;
    gap: 2rem;

    .nav-link {
      color: var(--color-text-primary);
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      text-decoration: none;

      &:hover,
      &.router-link-active {
        background: rgba(255, 255, 255, 0.1);
        color: var(--color-primary-hover);
      }
    }
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

.user-name {
  color: var(--color-text-primary);
  font-weight: 600;
}
</style>
