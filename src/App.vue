<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const { currentUser } = storeToRefs(authStore)

onMounted(() => {
  // Simuler la connexion automatique de Alice (vendeur) pour la démo
  authStore.login('alice@test.com')
})
</script>

<template>
  <header class="navbar glass-panel">
    <div class="nav-container">
      <div class="logo">
        <RouterLink to="/">Collector.shop</RouterLink>
      </div>
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Catalogue</RouterLink>
        <RouterLink v-if="currentUser" to="/add-item" class="nav-link">Vendre un objet</RouterLink>
      </nav>
      <div class="user-menu">
        <div v-if="currentUser" class="user-profile">
          <img :src="currentUser.avatar" alt="Avatar" class="avatar" />
          <span>{{ currentUser.name }}</span>
          <button @click="authStore.logout()" class="btn btn-outline btn-sm">Quitter</button>
        </div>
        <div v-else>
          <!-- Bouton de mock pour la demo -->
          <button @click="authStore.login('alice@test.com')" class="btn btn-outline btn-sm">
            Connexion (Vendeur)
          </button>
          <button @click="authStore.login('bob@test.com')" class="btn btn-primary btn-sm ml-2">
            Connexion (Acheteur)
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="page-wrapper container">
    <RouterView />
  </main>
</template>

<style scoped>
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
}

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
}

.nav-link {
  color: var(--color-text-primary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
}

.nav-link:hover,
.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-primary-hover);
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
