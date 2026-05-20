<template>
  <v-app :class="isDark ? 'bg-background' : 'bg-background'">
    <PublicNavbar />

    <v-main class="d-flex align-center justify-center min-h-screen py-12 px-4 position-relative pt-16">
      <!-- Background Decoration -->
      <div class="position-fixed top-0 left-0 w-100 h-100 z-negative overflow-hidden pointer-events-none opacity-20">
        <div class="blob-1 position-absolute rounded-circle bg-primary-container"></div>
        <div class="blob-2 position-absolute rounded-circle bg-secondary-container"></div>
      </div>

      <div class="w-100" style="max-width: 448px; z-index: 1;">
        <router-view />
      </div>
    </v-main>

    <PublicFooter />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import PublicFooter from '@/components/layout/PublicFooter.vue'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
</script>

<style scoped>
.z-negative {
  z-index: -10;
}
.pointer-events-none {
  pointer-events: none;
}
.blob-1 {
  width: 40%;
  height: 40%;
  top: -10%;
  right: -10%;
  filter: blur(120px);
}
.blob-2 {
  width: 30%;
  height: 30%;
  bottom: -10%;
  left: -10%;
  filter: blur(100px);
}
</style>