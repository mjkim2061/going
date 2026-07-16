<script setup>
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import SiteMapChatbot from '@/components/chatbot/SiteMapChatbot.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>

    <AppFooter />
    <SiteMapChatbot />
  </div>
</template>
