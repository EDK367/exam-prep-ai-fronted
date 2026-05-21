<template>
  <v-footer class="border-t footer" border-color="outline-variant" :class="isDark ? 'bg-inverse-surface' : 'bg-surface-container-low'">
    <v-container class="d-flex flex-column flex-md-row justify-space-between align-center ga-4 max-w-7xl mx-auto px-4 px-md-8 py-6">
      <div class="text-center text-md-start d-flex flex-column align-center align-md-start ga-2">
        <AppLogo to="/home" :size="44" :max-width="180" text-class="text-h6" />
        <p class="text-label-sm text-on-surface-variant opacity-80 mb-0">© {{ new Date().getFullYear() }} Exam Prep AI. All rights reserved.</p>
      </div>

      <div class="d-flex flex-wrap justify-center ga-4">
        <v-btn variant="text" class="text-label-sm text-on-surface-variant footer-link">About</v-btn>
        <v-btn variant="text" class="text-label-sm text-on-surface-variant footer-link">Contact</v-btn>
        <v-btn variant="text" class="text-label-sm text-on-surface-variant footer-link">Privacy Policy</v-btn>
        <v-btn variant="text" class="text-label-sm text-on-surface-variant footer-link">Terms of Service</v-btn>
      </div>

      <div class="d-flex ga-3">
        <v-btn icon variant="text" size="small" class="social-btn text-on-surface-variant"><v-icon icon="mdi-web"></v-icon></v-btn>
        <v-btn icon variant="text" size="small" class="social-btn text-on-surface-variant"><v-icon icon="mdi-share-variant"></v-icon></v-btn>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import AppLogo from '@/components/common/AppLogo.vue'

const theme = useTheme()
const isDark = computed(() => theme.global.name.value === 'dark')
</script>

<style scoped>
.footer {
  transition: all 0.3s ease;
}

.footer-logo {
  transition: all 0.3s ease;
}

.footer-logo:hover {
  opacity: 0.8;
}

.footer-link {
  transition: all 0.3s ease;
  position: relative;
}

.footer-link:hover {
  transform: translateY(-2px);
}

.social-btn {
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: rotate(360deg) scale(1.1);
}

.max-w-7xl {
  max-width: 1280px;
}
</style>
