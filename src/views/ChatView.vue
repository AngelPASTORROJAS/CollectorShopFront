<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { collectorAPI } from '@/api'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import type { CollectibleItemDto } from '@/types/models'

const route = useRoute()
const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()

const item = ref<CollectibleItemDto | null>(null)
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  const itemId = Number(route.params.itemId)
  item.value = await collectorAPI.items.getByIdAsync(itemId)

  if (item.value) {
    // Utilisation de la logique du store (assure-toi qu'il utilise aussi collectorAPI)
    await chatStore.fetchMessages(item.value.Id)
    scrollToBottom()
  }
})

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const send = async () => {
  // Utilisation de authStore.user?.Id (le DTO d'authentification)
  if (!newMessage.value.trim() || !item.value || !authStore.user?.Id) return

  // Logique d'envoi : on envoie au OwnerId (vendeur)
  await chatStore.sendMessage({
    ReceiverId: item.value.OwnerId,
    Content: newMessage.value
  })

  newMessage.value = ''
  scrollToBottom()
}
</script>

<template>
  <div class="chat-page animate-fade-in" v-if="item && authStore.user">
    <div class="chat-container glass-panel">
      <!-- Header -->
      <div class="chat-header">
        <button class="btn btn-outline btn-sm" @click="router.back()">← Retour</button>
        <div class="item-info">
          <!-- Image placeholder cohérente -->
          <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100" class="thumb" />
          <div>
            <h3>{{ item.Title }}</h3>
            <p class="subtitle">Propriétaire : #{{ item.OwnerId }}</p>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="msg in chatStore.messages"
          :key="msg.Id"
          class="message-wrapper"
          :class="{ mine: msg.SenderId === authStore.user.Id }"
        >
          <div class="message-bubble">
            <p>{{ msg.Content }}</p>
            <span class="time">{{ new Date(msg.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
          </div>
        </div>
        <div v-if="chatStore.messages.length === 0" class="empty-state">
          Commencez la discussion !
        </div>
      </div>

      <!-- Input -->
      <form class="chat-input-area" @submit.prevent="send">
        <input
          type="text"
          v-model="newMessage"
          class="form-input"
          placeholder="Écrivez votre message..."
          required
        />
        <button type="submit" class="btn btn-primary">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-page {
  height: calc(100dvh - 12rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-container {
  width: 100%;
  max-width: 800px;
  height: 100%;
  max-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.2);

  .item-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .thumb {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      object-fit: cover;
    }

    h3 { margin: 0; font-size: 1.1rem; }
    .subtitle { margin: 0; font-size: 0.8rem; color: var(--color-text-secondary); }
  }
}

.chat-messages {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .message-wrapper {
    display: flex;
    width: 100%;

    &.mine { justify-content: flex-end; }

    .message-bubble {
      max-width: 70%;
      padding: 1rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.1);
      position: relative;
    }

    &.mine .message-bubble {
      background: var(--color-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    &:not(.mine) .message-bubble {
      border-bottom-left-radius: 4px;
    }
  }

  .time {
    font-size: 0.7rem;
    opacity: 0.7;
    display: block;
    text-align: right;
    margin-top: 0.5rem;
  }
}

.chat-input-area {
  padding: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
}

.empty-state {
  text-align: center;
  color: var(--color-text-secondary);
  margin-top: 2rem;
}
</style>
